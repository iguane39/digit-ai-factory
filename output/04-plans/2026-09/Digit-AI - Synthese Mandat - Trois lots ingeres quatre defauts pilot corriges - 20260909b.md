---
destinataire: humain
---

# Synthèse de mandat — la boîte de retours est vide, quatre défauts du pilot sont corrigés et prouvés, et votre dépôt local doit être reconstruit avant de repartir (09/09/2026)

Trois lots de retours sont arrivés pendant ce traitement, dont deux sous un nom réel de client dans un répertoire suivi : ils sont nettoyés, ingérés, et la boîte est vide. Quatre défauts qui vous appartenaient ont été corrigés et chacun est prouvé par un contrôle rejoué avant et après, jamais par une affirmation. Le plus lourd expliquait un fait que vous avez constaté vous-même ce matin : une demande employant une formule d'appel n'a rien déclenché, parce que toute la chaîne de vérification du poste mesurait un répertoire que la session ne charge pas — vingt-quatre outils déclarés alignés, aucun réellement disponible. Ce que ça change : la vérification nomme désormais l'endroit qu'elle a regardé, et se conteste. Deux choses sont attendues de vous. D'abord un feu vert pour reconstruire la copie locale du dépôt, devenue incompatible avec la version publiée depuis qu'une autre session a nettoyé l'historique cet après-midi — sans ce geste, rien de ce qui a été fait ici ne pourra être publié. Ensuite un arbitrage de fond sur la forme des rapports d'audit : il engage tout ce qui sera remis ensuite au commanditaire, et c'est la seule voie — aucun contrôle ne peut départager deux formes dont chacune a sa légitimité.

## 1. En-tête d'identification

- **quoi** — mandat « traite tous les todos et retours » : vidage de la boîte d'entrée, correction des items du registre visant ce dépôt, remontée des constats faits en passant.
- **sur quoi** — la factory `digit-ai-factory` (le pilot) : sa boîte de retours, son registre d'améliorations, ses oracles et sa chaîne d'alignement du parc.
- **quand** — 2026-09-09 15:45 UTC+02:00 (Europe/Paris), durée ≈ 1 h, relevée à l'horloge (premier événement consigné à 12:47 Z, dernier à 13:40 Z) et non estimée.
- **qui** — pilot `digit-ai-factory`, arbre de travail sur `b161170` (histoire locale, antérieure à la republication de cet après-midi) ; oracles mobilisés : `oracle-boite-entree`, `oracle-todo`, `oracle-skills`, `oracle-portee-doctrine`, `oracle-synthese`, `oracle-catalogues`, `oracle-gabarits-documents`, `oracle-readme-dossiers`, `oracle-nom-client-publie`, plus le lanceur `oracles\self-tests.mjs`.

## 2. Verdict en une ligne

**Boîte d'entrée PASS (3 lots ingérés, 7 candidatures, 0 en attente) ; registre `oracle-todo` PASS ; suite complète 103/103 vertes, exit 0 ; 4 items clos ou avancés — TF-0995, TF-0996 et TF-0998 corrigés avec leur rouge→vert mesuré, TF-0999 livré à moitié et laissé ouvert ; 3 cliquets de recette montés (`oracle-skills` 72 → 78, `oracle-portee-doctrine` 5 → 9, `oracle-synthese` fixtures S24 (la règle qui juge une absence conclue d'une recherche par nom) ajoutées) ; 8 sites du dépôt qui résolvaient en dur la copie installée ramenés à UNE fonction ; 2 classes de défaut créées au référentiel (v1.3.1 → v1.5.0) ; 2 constats faits en passant remontés en candidature (TF-1002, TF-1003) ; 2 noms réels de produit que J'AVAIS moi-même introduits au registre, rattrapés par l'anonymiseur ; porte de publication : 250 constats dont 249 dans l'historique (passif connu, arbitrage déjà rendu) et 1 seul dans l'arbre de travail, qui est un faux positif remonté en candidature ; registre à 56 items ouverts, dont 32 visant ce dépôt et 24 des dépôts frères, hors de portée sans mandat d'écriture.**

## 3. Décisions attendues de l'humain

Deux décisions attendent. La première conditionne toute publication et ne peut pas être différée longtemps ; la seconde est un arbitrage de fond qui peut se prendre à froid.

> **D-1 — La copie locale de votre dépôt de pilotage est devenue incompatible avec la version publiée cet après-midi : la reconstruit-on maintenant par l'outil prévu, ou laisse-t-on le travail en attente sur l'ancienne version ?**
>
> Une autre session a exécuté cet après-midi, sur votre décision explicite du jour, le retrait des noms de clients et de produits de tout l'historique du dépôt, puis l'a republié en écrasant l'ancienne version. Six cent quarante-et-un enregistrements et quarante-trois références sont conservés, aucun n'est perdu, et le contrôle de publication est vert sur la version reconstruite. Mais la copie de ce poste est restée sur l'ancienne version : elle porte cinq cent vingt-sept enregistrements que la nouvelle n'a pas, et la nouvelle en porte cinq cent vingt-six que celle-ci n'a pas. Conséquence immédiate et déjà constatée ici : le canal d'entrée des retours s'est fermé de lui-même au milieu du traitement, et il a fallu vérifier à la main qu'aucun numéro ne pouvait entrer en collision pour continuer. Tant que la copie n'est pas reconstruite, rien de ce qui a été produit dans ce tour ne peut être publié. L'outil de reconstruction sauvegarde tout, rejoue le travail local, et ne publie jamais rien de lui-même — mais il exige que le travail en cours soit d'abord enregistré localement, ce que je n'ai pas fait sans votre accord.
>
> **Recommandation : (a).** Sources consultées : le noyau `CLAUDE.md` du pilot, dont la règle R-38 (aucun livrable publié sans feu vert humain) réserve toute publication à un accord de votre part et la règle R-29 (les dépenses et les portes de gouvernance restent humaines) fait de toute réécriture un geste qui vous revient — c'est elle qui tranche, et c'est pourquoi la question vous revient ; le mode opératoire de réécriture d'historique dans `references\TODO-FORGE.md`, qui écrit qu'une copie devenue incompatible est « à recloner, pas à fusionner » ; le message de la session qui a exécuté le geste, qui nomme l'outil `bootstrap.mjs --rebatir` et confirme la sauvegarde vérifiée avant l'opération ; et ma propre mesure de l'écart entre les deux versions. Motif du choix : c'est la seule voie qui conserve à la fois le travail de ce tour et le nettoyage que vous avez décidé, et l'outil refuse de lui-même tout ce qui serait destructeur.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) enregistrer le travail localement, puis reconstruire par l'outil | effort simple × court ; le travail est rejoué automatiquement et une sauvegarde est prise avant | exclut de garder l'ancienne version locale comme référence |
| (b) laisser en l'état et reconstruire plus tard | effort nul maintenant ; mais le canal des retours reste fermé et chaque lot reçu devra être forcé à la main | exclut toute publication, et exclut que les lots suivants entrent normalement |
| (c) reconstruire d'abord, réappliquer le travail à la main ensuite | effort moyen × moyen ; contrôle total sur ce qui est repris | exclut le rejeu automatique, et fait porter à l'humain un travail que l'outil sait faire |

Si rien n'est décidé : l'option (b) s'applique d'elle-même — le travail reste sur disque, vérifié et vert, mais invisible pour tout autre poste, et le canal d'entrée des retours reste à forcer lot par lot.

> **D-2 — Deux rapports d'audit que le commanditaire désigne comme la référence échouent le contrôle de forme que la bibliothèque déclare pour eux, pendant que la sortie du générateur actuel le passe : laquelle des deux formes fait foi ?**
>
> Un produit a remonté ce matin que le rapport d'audit qu'il vient de remettre ne ressemble pas à ce que le commanditaire attend, et il désigne deux livrables d'août comme le standard. J'ai rejoué le contrôle moi-même sur celui des deux qui est présent sur ce poste, plutôt que de recopier son chiffre : il échoue, avec treize erreurs — il lui manque le bandeau de verdict, les dix-huit sections de dimensions, les indicateurs de synthèse, les chemins de lecture et le manifeste des écarts, et son script d'affichage lève une erreur à l'ouverture. La sortie du générateur d'aujourd'hui, elle, passe le même contrôle. Les deux formes sont donc incompatibles, et jusqu'à ce tour rien ne l'écrivait nulle part : un projet qui consultait la bibliothèque croyait que le générateur produisait la forme des références. C'est désormais écrit, avec les chiffres. Ce qui ne peut pas être écrit à votre place, c'est laquelle des deux a raison — l'une des deux réponses rend périmés deux livrables que votre commanditaire tient pour le modèle, l'autre ouvre un chantier de refonte du générateur dans un autre dépôt.
>
> **Recommandation : (a).** Sources consultées : l'entrée de la bibliothèque de gabarits pour cette famille de documents, `gabarits\documents\catalogue.jsonl`, qui déclare elle-même quel contrôle fait foi ; ce contrôle, `toolserifier-rapport-html.mjs`, rejoué ici sur le livrable de référence disponible ; et le lot du produit, qui donne le verdict des deux autres livrables. Le noyau `CLAUDE.md` ne tranche pas ce point : sa règle R-43 dit seulement que les règles de la forge impliquée priment, ce qui renvoie la forme au commanditaire. Motif du choix : le commanditaire est celui qui reçoit le document, et une forme qu'il refuse ne devient pas juste parce qu'un contrôle la valide — mais l'inverse est vrai aussi, et c'est pourquoi la question vous revient plutôt que d'être tranchée par l'outil.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) les références font foi : le générateur doit regagner ce qu'elles portent | effort complexe × long, dans un dépôt frère, donc un mandat d'écriture en plus | exclut de considérer les livrables d'août comme périmés |
| (b) le générateur fait foi : les deux références sont déclarées périmées | effort simple × court ici, mais il faut l'annoncer au commanditaire qui les désigne comme le standard | exclut de récupérer ce que les références portaient et que le générateur ne rend pas |
| (c) les deux coexistent, chacune avec son usage déclaré | effort moyen × moyen ; la bibliothèque porte deux familles au lieu d'une | exclut d'avoir un seul contrôle qui fasse foi, donc un seul verdict opposable |

Si rien n'est décidé : l'écart reste écrit dans la bibliothèque, ce qui supprime la surprise mais pas le désaccord — chaque rapport d'audit remis rouvrira le même aller-retour avec le commanditaire.

## 4. Traité — avec sa preuve

- **TF-0995 — toute la chaîne de vérification du parc mesurait un répertoire que la session ne charge pas.** Une fonction unique `scripts\lib-config-installee.mjs` remplace huit résolutions écrites en dur ; règle **K10** (le contrôle qui nomme la racine mesurée) ajoutée à `oracle-skills`, qui nomme désormais la racine mesurée et la variable qui l'a décidée, en vert comme en rouge ; la phrase de l'en-tête qui affirmait le contraire est corrigée.
  - preuve : rouge→vert rejoué sur l'oracle réel, même racine vide — résolution d'AVANT : `PASS`, 0 constat, qui est exactement le verdict du 09/09 ; résolution d'APRÈS : `FAIL`, 21 constats, K10 nommant le répertoire et le remède. Self-test `oracle-skills` 72/72 → **78/78**, exit 0. Aucune régression sur ce poste : `PASS`, 0 constat, mesuré.
- **TF-0996 — la doctrine ne se déclenche pas quand la session s'ouvre au-dessus du produit.** Règle **PD3** (la portée de la session courante) ajoutée à `oracle-portee-doctrine` : elle constate qu'un produit instancié vit dans un sous-dossier direct alors que la racine de session n'en porte pas, nomme les quatre hameçons qui ne s'exécutent pas, et donne les deux gestes qui réparent.
  - preuve : self-test 5/5 → **9/9**, exit 0 ; rejoué sur le parc réel dans les deux sens — depuis le pilot `PASS` et sortie 0, depuis le dossier parent `FAIL` en nommant les deux produits imbriqués et sortie 1.
- **TF-0998 — le juge des restitutions accusait un libellé que le gabarit impose.** Le mot « motif » sort du vocabulaire de détection de la règle S24 et y revient borné à ses emplois de recherche ; le libellé structurel du bloc 5 est retiré de la phrase avant tout test.
  - preuve : les deux phrases exactes mesurées, détecteur d'avant contre détecteur d'après — la ligne refusée ce matin était détectée AVANT (déclencheur relevé : le mot « motif » lui-même) et ne l'est plus APRÈS ; une vraie recherche par nom reste détectée APRÈS, déclencheur « motifs de nom », ce qui établit que le mot a été borné et non supprimé. Les deux sont en fixture double sens ; self-test `oracle-synthese` exit 0.
- **Trois lots de retours reçus, nettoyés et ingérés — la boîte est vide.** Deux d'entre eux sont arrivés **directement dans le répertoire suivi sous un nom réel de client**, ce qui est la fenêtre d'exposition que le registre documente ; ils ont été réécrits et renommés sur disque avant toute autre opération.
  - preuve : `oracle-boite-entree` **PASS**, exit 0 ; 4 noms réels retirés au total, 0 refus de substitution ; 7 candidatures créées, TF-0995 à TF-1001.
- **Un rôle de dossier non rédigé, qui mettait la suite du dépôt au rouge.** Le sas d'arrivée des lots n'avait pas de rôle écrit ; il est rédigé d'après la source qui le documente, pas d'après une supposition.
  - preuve : `oracle-readme-dossiers` **FAIL → PASS**, exit 0 ; suite complète 102/102 puis **103/103** vertes.
- **TF-1002 et TF-1003 — deux constats faits en passant, remontés plutôt que gardés.** Le premier : la porte de publication accuse un sigle à l'intérieur d'un mot ordinaire, sur le commentaire qui documente précisément ce piège, et localise son constat 29 lignes trop bas. Le second : le contrôle d'entrée du registre compte des enregistrements là où l'invariant qu'il protège est un numéro maximum, ce qui le rend faux dès que l'historique est réécrit.
  - preuve : les deux sont ingérés au registre et jugés — `oracle-todo` **PASS**, exit 0 ; le second est établi par mesure directe, les deux versions du registre plafonnant au même numéro.
- **TF-0999 — l'écart de forme des rapports d'audit est désormais écrit.** L'entrée de la bibliothèque porte les trois livrables avec leur verdict et nomme la contradiction ; c'est la moitié mécanisable, l'autre est la décision D-2.
  - preuve : le verdict de la référence disponible **rejoué ici**, exit 1 et 13 erreurs, et non recopié du lot ; les deux autres verdicts sont **marqués comme non vérifiés** par ce poste. `oracle-catalogues` et `oracle-gabarits-documents` exit 0 après écriture, diff d'une seule ligne.

## 5. Non traité — avec son motif

- Les 24 items du registre visant des dépôts frères (forges des données, des agents, de l'audit, du design, des conventions, et le socle des pages) — motif : `garde_fou` — aucune écriture dans un dépôt frère hors mandat humain, et aucun mandat n'est déclaré dans cette session.
- Les 32 items restants visant ce dépôt, dont plusieurs décidés et lourds : la couverture des contrôles du produit, la porte de fraîcheur de déploiement, la détection des doublons de candidature — motif : `borne_atteinte` — le mandat a été traité par ordre de gravité et de preuve du coût, en commençant par ce que les lots du jour désignaient comme bloquant ; ce qui reste est ouvert, mesuré, et non fermé à tort.
- L'arbitrage de la forme des rapports d'audit, et la reconstruction de la copie locale du dépôt — motif : `dependance_bloc_3` — ce sont les deux décisions D-1 et D-2 du bloc 3.
- Le passif de 249 constats de la porte de publication dormant dans l'historique — motif : `hors_mandat` — l'arbitrage a déjà été rendu ce jour et exécuté par une autre session ; il n'est pas rouvert ici.

## 6. Écarts à la lettre

- **Vous avez demandé** de traiter tous les todos et tous les retours. **J'ai fait** tous les retours — la boîte est vide et vérifiée — mais une partie seulement des todos. **Pourquoi** : sur 56 items ouverts, 24 visent des dépôts frères où l'écriture est interdite sans votre mandat, et le reste dépasse la borne d'un tour. J'ai traité par gravité déclarée et preuve du coût plutôt que d'entamer superficiellement un grand nombre d'items.
- **Vous avez demandé** un traitement, **j'ai en plus** créé deux classes de défaut au référentiel et remonté deux candidatures qui ne venaient d'aucun lot. **Pourquoi** : la première classe était exigée par la procédure d'ingestion, qui refuse un lot dont la classe est inconnue ; les deux candidatures sont des défauts rencontrés en exécutant le mandat, et la règle du dépôt veut qu'un constat en passant devienne un candidat plutôt que de se perdre.

## 7. Risques

- **Le travail de ce tour n'existe que sur ce poste, et la copie locale est incompatible avec la version publiée.**
  - signal : un autre poste ouvre le dépôt et n'y trouve rien de ce qui précède ; ou une tentative de publication est refusée.
  - parade : la décision D-1, option (a). En attendant, une sauvegarde du travail en cours existe déjà sous forme de correctif, prise par la session qui a réécrit l'historique.
- **Une autre session écrit dans ce dépôt en même temps que moi.**
  - signal : un fichier modifié qu'aucune des deux sessions ne reconnaît, ou un numéro de registre refusé.
  - parade : le contact est établi, les numéros sont répartis explicitement — j'ai pris jusqu'à TF-1003, l'autre session prend la suite — et le registre est en ajout seul avec annulation en cas d'échec, donc aucune écriture concurrente ne perd de travail. Je l'ai également prévenue que mon travail touche un fichier qu'elle avait sauvegardé avant ma modification.
- **La règle K10 est déclarative et ne bloque pas : un poste mal configuré peut encore ouvrir un run.**
  - signal : un verdict vert dont la ligne K10 nomme un répertoire dépourvu de ses outils.
  - parade : acceptation déclarée, et elle est raisonnée — poser une racine de configuration engage toutes les sessions du poste, ce qui est une décision humaine ; et lorsque la racine chargée est réellement vide, ce sont les autres règles qui rougissent, avec un remède mécanique.
- **Deux classes de défaut ont été créées sans clôture fondatrice, et le tableau de bord les compte comme suspectes.**
  - signal : la contre-métrique du tableau des récidives montre des classes créées sans fondateur qui augmentent semaine après semaine.
  - parade : acceptation déclarée pour ce tour — les deux sont attachées à un item ouvert qui les fondera à sa clôture ; le mécanisme de signalement a fonctionné et les a nommées de lui-même.

## 8. Prochaines actions

Ce tableau ne liste que les RESTES : ce qui est fait est au bloc 4 avec sa preuve, et le répéter ici transformerait un outil d'arbitrage en compte rendu.

| # | Action | Acteur | Motif / raison | Effort |
|---|---|---|---|---|
| A-1 | Enregistrer localement le travail de ce tour — 28 fichiers, dont `todo\TODO.jsonl`, portant TF-0995, TF-0996, TF-0998 et TF-0999 | auto_ia | `dependance_bloc_3` — attend la décision D-1, dont chaque option commence par ce pas ; à défaut, rien de ce tour n'est publiable ni visible depuis un autre poste, et un incident de disque le perdrait | simple × court |
| A-2 | Reconstruire la copie locale par `bootstrap.mjs --rebatir`, l'outil prévu pour ce cas (TF-0877) | auto_ia | `dependance_bloc_3` — attend la décision D-1 ; à défaut, le canal d'entrée des retours reste à forcer lot par lot, comme il a fallu le faire deux fois dans ce tour | simple × court |
| A-3 | Aligner la forme des rapports d'audit sur ce que la décision aura tranché (TF-0999) | auto_ia | `dependance_bloc_3` — attend la décision D-2, et l'option (a) déplace le travail dans un dépôt frère ; à défaut, chaque rapport remis rouvrira le même aller-retour avec le commanditaire | complexe × long |
| A-4 | Traiter les 24 items du registre visant des dépôts frères, dont TF-1000 et TF-1001 remontés aujourd'hui | auto_ia | `garde_fou` — aucune écriture dans un dépôt frère hors mandat humain déclaré ; à défaut, ces items resteront ouverts quel que soit le nombre de tours de traitement | complexe × long |
| A-5 | Instruire les 32 items restants visant ce dépôt, TF-0674, TF-0682 et TF-0956 en tête de score | auto_ia | `borne_atteinte` — borne de ce tour, le mandat ayant été traité par gravité déclarée et preuve du coût ; à défaut, l'écart entre ce que le registre porte et ce qui est réellement corrigé continue de croître | complexe × très long |
| A-6 | Trancher D-1 : reconstruire la copie locale, ou laisser le travail en attente — répondre « D-1 (a) », « (b) » ou « (c) » ; le geste qui suivra est `bootstrap.mjs --rebatir`, joué par l'IA (TF-0995) | manuelle_utilisateur | `decision` — la règle R-29 du noyau réserve à l'humain toute réécriture, et R-38 toute publication ; sinon : l'option (b) s'applique d'elle-même et le dépôt reste figé | simple × court |
| A-7 | Trancher D-2 : quelle forme fait foi pour les rapports d'audit — répondre « D-2 (a) », « (b) » ou « (c) » ; l'entrée concernée est `gabarits\documents\catalogue.jsonl` (TF-0999) | manuelle_utilisateur | `decision` — l'une des options déclare périmés deux livrables que votre commanditaire désigne comme le modèle, ce qu'aucun contrôle ne peut trancher ; sinon : l'écart reste écrit mais le désaccord entier | moyen × moyen |
| A-8 | Ouvrir, si vous le souhaitez, un mandat d'écriture sur les dépôts frères — nommer les forges dans votre prochain message ; la règle est au noyau `CLAUDE.md` (débloque TF-1000 et TF-1001) | manuelle_utilisateur | `decision` — ouvrir un mandat d'écriture chez un tiers engage un dépôt dont ce poste n'est pas responsable ; sinon : l'action A-4 reste bloquée indéfiniment | simple × court |

*Ordre* : les actions de l'IA d'abord, puis les vôtres — et à l'intérieur, la dépendance plutôt que la préférence : A-1 conditionne A-2, qui conditionne toute publication ; A-3 et A-4 attendent chacune leur décision ou leur mandat ; A-5 est le seul reste qui ne dépend de rien et peut repartir au prochain tour.

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Trois lots ingeres et quatre defauts du pilot corriges - 20260909b.md` — ce document.
- `scripts\lib-config-installee.mjs` — la fonction unique de résolution (fichier neuf).
- `oracles\oracle-skills.mjs` — règle K10 et sa fixture ; `oracles\oracle-portee-doctrine.mjs` — règle PD3 ; `oracles\oracle-synthese.mjs` — règle S24 et sa paire de fixtures.
- `bootstrap.mjs`, `oracles\hook-page-html.mjs`, `oracles\oracle-gabarits-documents.mjs`, `scripts\rebatir-clone.mjs`, `scripts\relever-empreintes-skills.mjs`, `scripts\verifier-familles-mesure.mjs`, `scripts\verifier-rendu-instances.mjs` — les sept autres sites recâblés.
- `gabarits\documents\catalogue.jsonl` — l'entrée des rapports d'audit et son écart écrit.
- `todo\CLASSES.json` — référentiel des classes, v1.3.1 → v1.5.0 ; `todo\TODO.jsonl` et ses vues régénérées.
- `input\00-retours\` — les trois lots pseudonymisés et ingérés ; `input\00-retours\_arrivee\README.md` — le rôle rédigé.
- `input\01-candidatures\porte-publication-faux-positif-20260909a.tf.jsonl` et `input\01-candidatures\preflight-ingestion-histoire-reecrite-20260909a.tf.jsonl` — les deux constats remontés.
- Aucun livrable HTML n'a été produit dans ce tour : la critique d'implémentation de forge-design est sans objet.
