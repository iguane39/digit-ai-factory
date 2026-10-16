---
destinataire: humain
---

# Campagne des todos et retours du 20/09/2026 : 18 items décidés clos sur preuve rejouée, 18 attendent un geste de votre part ou d'un produit, rien n'est publié

## 0. Synthèse d'ouverture

Tout ce que l'IA pouvait traiter parmi vos 36 décisions en attente est traité : 18 items sont corrigés,
prouvés par un contrôle que j'ai rejoué moi-même, et clos au registre des travaux. Les 18 autres ne
dépendent plus de l'IA : ils attendent une décision de votre part, un run ouvert chez un produit, ou
une échéance. Aucun retour n'attendait dans la boîte d'entrée. Les agents ont vu 8 défauts en passant ;
ils sont entrés au registre comme candidats, sans être corrigés, comme la règle le veut. Tout le
travail est enregistré sur ce poste dans 5 dépôts et rien n'est publié sur GitHub. Ce qui est attendu
de vous : 5 décisions, dont la publication, à laquelle je recommande de répondre en premier, parce que
l'autre poste travaille sur les mêmes dépôts.

## 1. En-tête d'identification

- **quoi** — campagne « Traite tous les todos et retours », restitution complète ; elle remplace les
  points d'étape rendus au fil du tour.
- **sur quoi** — le pilot `digit-ai-factory` et 4 forges : `digit-ai-forge-agents`,
  `digit-ai-forge-data`, `digit-ai-forge-audit`, `digit-ai-forge-tests`.
- **quand** — le 20/09/2026, de 17h27, première heure relevée par commande, à 20h56
  (Europe/Paris) ; la reprise de la session est antérieure à 17h27 et n'a pas été horodatée.
- **qui** — session pilot Claude Fable 5.1 ; pilot passé de `3d87a2b8` à l'enregistrement de cette restitution ; 7 agents de
  campagne délégués, 1 par dépôt et jamais 2 en même temps dans un même dépôt (6 sur le modèle Opus
  pour la construction complexe, 1 sur Sonnet pour forge-data) ; escalade de modèle : aucune.
- **intention** — que tout ce que vous avez déjà décidé au registre soit réellement corrigé, prouvé
  et clos, et que rien de ce qui arrive par les retours ne reste hors registre. **Test rétro** :
  l'intention est servie pour les 18 items que l'IA pouvait mener au bout, chacun clos avec une preuve
  rejouée par le pilot et la règle ou le contrôle qui porte désormais la correction ; elle ne l'est
  pas pour les 18 autres, qui restent décidés et non faits tant que les décisions D-2 à D-6 et les
  runs chez les produits ne sont pas rendus.

## 2. Verdict en une ligne

**18 items clos sur 36** (17 décidés et 19 en cours au départ ; 9 et 9 à l'arrivée) · 20 traitables
par l'IA, 18 clos, 2 ouverts avec leur plan · **28 enregistrements locaux dans 5 dépôts, 0 publié** ·
1 régression d'agent trouvée par le rejeu du pilot, corrigée et rejouée · harnais du pilot : 2
recettes en défaut sur 130, les 2 mêmes qu'avant la campagne, 0 ajoutée · `oracle-todo` **PASS** ·
boîte d'entrée **PASS**, 0 lot en attente · 8 candidats entrés, TF-1244 à TF-1251.

## 3. Décisions attendues de vous

5 décisions, D-2 à D-6 ; la D-1 de cette session était la question d'ouverture, à laquelle vous avez
répondu. Avant elles, l'inventaire de ce qui est à l'arrêt.

Inventaire des bloquants :

- **La publication des 28 enregistrements locaux** — il faut votre feu vert — sinon le travail ne vit
  que sur ce poste, et l'autre poste, qui publie sur les mêmes dépôts, recrée la divergence du 19/09.
- **La mise à jour de la copie installée des skills** — il faut votre feu vert ; 5 skills de la forge
  des outils sont en avance sur la copie qui s'exécute — sinon ce poste exécute des skills plus
  anciens que ceux qui sont versionnés, et le harnais du pilot garde 1 de ses 2 défauts.
- **La bascule du schéma de base de données du rapport d'audit sur le canevas de schémas** — il faut
  décider d'où viennent 4 attributs visuels que les données du rapport ne portent pas, et quelle forme
  prend la copie conforme du canevas chez la forge d'audit — sinon le rapport d'audit garde l'ancien
  rendu, déclaré comme tel.
- **6 corrections qui vivent chez des produits** — la porte de fraîcheur de déploiement qui juge un
  échantillon, les captures qui ne sont pas en pleine page, 15 contrôles sans recette, 39 manques
  d'héritage, le rangement de 14 porteurs de secrets, un contrôle de transparence cité 17 fois et
  inexistant — il faut que chaque produit les reçoive et les traite chez lui, le pilot n'y écrit
  pas — sinon elles restent décidées et non faites.
- **3 items du produit de communication et de réseaux sociaux** — le registre des issues d'appels
  d'offres, le plan de mesure hebdomadaire, le premier cas réel de 4 semaines — il faut que vous
  ouvriez un run chez ce produit — sinon ils restent décidés et non commencés.
- **Les 7 étapes non écrites de la chaîne de traduction et d'audit** — il faut un run réel sur un
  second produit pour observer ces étapes au lieu de les inventer — sinon l'item reste ouvert.
- **L'activation du circuit de contrôle hébergé du pilot** — il est construit et inactif ; il faut
  votre geste d'activation, que je déconseille tant que le harnais porte 2 défauts sur ce poste —
  sinon le pilot reste publié sans rejeu hébergé.
- **4 décisions déjà posées dans des restitutions antérieures et restées sans réponse** — les
  hameçons à poser quand une session s'ouvre au-dessus de la racine d'un produit ; les 2 teintes de
  la marque sous le seuil de contraste, la police et la position du logo ; le type d'entrant « appel
  d'offres » à la forge de conception ; la validation d'une référence par cible pour les 3 barres de
  communication — il faut vos réponses — sinon ces 4 items restent en cours.
- **2 items suspendus à une échéance ou à un fait extérieur** — le déclencheur automatique du style
  rédactionnel, mesuré à 90,3 % pour un seuil de 95 %, se revoit le 15/10 ; le produit sans dépôt git
  reste ouvert par votre choix du 24/08 — rien à fournir aujourd'hui.

> **D-2 — Les 28 enregistrements locaux de la campagne se publient-ils maintenant sur GitHub ?**
>
> La campagne a produit 16 enregistrements au pilot, 8 chez la forge des outils, 2 chez la forge des
> données, 1 chez la forge d'audit et 1 chez la forge des tests, tous locaux. Chaque correction a été
> rejouée par le pilot, et les vérifications natives des 4 forges sont sans échec nouveau. L'autre
> poste publie sur les mêmes dépôts : ce matin, 7 dépôts avaient divergé pour cette seule raison.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md` R-38 §4-5 (la publication est un feu
> vert humain, la porte des noms est jouée par l'hameçon de publication) ; synthèse du 19/09 sur la
> synchronisation suspendue (7 dépôts divergés, 41 fichiers en conflit simulé) ; mesure du tour :
> `git rev-list --left-right --count HEAD...origin/main` rendait `0 0` au départ dans les 5 dépôts.

| Option | Coût | Exclusions |
|---|---|---|
| (a) je publie les 5 dépôts : `git fetch` d'abord, rejeu par-dessus l'autre poste s'il a publié entre-temps, porte des noms jouée, puis relevé de fraîcheur | effort simple × court | exclut de relire vous-même les 28 enregistrements avant qu'ils soient publics |
| (b) rien n'est publié pour l'instant | effort nul | exclut que l'autre poste voie ces corrections ; il peut refaire le même travail, comme le 14/09 |
| (c) je publie les 4 forges et pas le pilot | effort simple × court | exclut un registre publié à jour : les clôtures citeraient des enregistrements de forges publiés depuis un registre qui ne l'est pas |

> **Si rien n'est décidé** : l'option (b) s'applique — tout reste local, et l'écart avec l'autre poste
> grandit à chacune de ses publications.

> **D-3 — La copie installée des skills se met-elle à jour sur les 5 skills modifiés par la campagne ?**
>
> Les skills vivent en 2 exemplaires : la source versionnée chez la forge des outils, et la copie
> installée sur ce poste, qui est celle qui s'exécute. La campagne a modifié 5 skills à la source : le
> socle des pages, les schémas, le registre des oracles, le générateur d'oracles, la revue de propale.
> Depuis ce soir, la mise à jour sait rejouer les vérifications des 4 dépôts qui consomment la copie
> installée, avant et après, et nommer celui qu'elle casse — c'est ce qui avait manqué 2 fois.
>
> **Recommandation : (a).** Source consultée : `gabarits\AGENT-CAMPAGNE.md`, section « Gate de
> propagation des skills » (la dérive se règle dans la même session, sur décision humaine explicite,
> jamais en silence) ; `oracles\consommateurs-skills.json` (4 consommateurs mesurés, suites jusqu'à 20
> minutes) ; sortie de `node oracles/oracle-skills.mjs` lue par 2 agents : FAIL, K2 sur 5 skills.

| Option | Coût | Exclusions |
|---|---|---|
| (a) je mets à jour la copie installée en mesurant les 4 dépôts consommateurs avant et après, et je vous rends le nom de tout dépôt qui passait et ne passe plus | effort simple × long, les suites des consommateurs durent | exclut une mise à jour immédiate : il faut attendre les 2 passes de vérification |
| (b) je mets à jour la copie installée sans mesurer les consommateurs, le raccourci étant déclaré dans la sortie | effort simple × court | exclut de savoir ce soir si une règle neuve du socle casse la suite d'une forge voisine |
| (c) la copie installée reste telle quelle | effort nul | exclut que ce poste exécute ce qui est versionné ; le test de forge-tests lié à la copie installée reste en échec |

> **Si rien n'est décidé** : l'option (c) s'applique — la copie installée reste en retard de 5 skills,
> et le contrôle des skills du harnais reste en défaut.

> **D-4 — Le rapport d'audit doit-il dessiner son schéma de base de données avec le canevas du skill de schémas, et si oui avec quelles règles d'habillage ?**
>
> Le schéma de base de données est dessiné par 2 moteurs : l'ancien, `renderERD` dans
> `tools/rapport-engine.mjs` de la forge d'audit, et le canevas `template-modele-donnees.html` du
> skill `digit-ai-schemas`, plus riche, que les 2 dépôts déclarent déjà comme celui qui fait foi. L'agent a mesuré ce qui empêche la bascule : le canevas attend 4 attributs d'habillage par
> table et par relation que les données du rapport ne portent pas, et la forge d'audit n'a aucun
> mécanisme pour tenir une copie conforme d'un composant d'un dépôt frère, ses outils devant rester
> autoportants.
>
> **Recommandation : (a).** Source consultée : rapport de l'agent de campagne de la forge d'audit du
> 20/09, qui chiffre le plan à 8 étapes et environ 6 heures d'IA ; `oracles/README.md` de la forge
> d'audit (scripts autoportants, aucune dépendance externe) ; l'item d'origine, qui proposait « import
> ou copie conforme déclarée ».

| Option | Coût | Exclusions |
|---|---|---|
| (a) habillage DÉRIVÉ des données existantes (une table qui porte une donnée personnelle est teintée, la cardinalité se lit sur la contrainte, rôle et infobulle restent vides) et copie conforme du canevas tenue par un fichier d'empreinte, avec un contrôle de dérive qui se tait quand le dépôt frère est absent | effort moyen × long | exclut les rôles et infobulles par table dans le rapport tant que les données ne les portent pas |
| (b) le contrat de données du rapport est étendu aux 4 attributs, puis même copie conforme | effort complexe × long : le contrôle de parité français-anglais, l'aller-retour des données et le kit de conformité sont touchés | exclut une bascule rapide ; chaque audit existant devra renseigner les attributs neufs |
| (c) la bascule est abandonnée : l'ancien moteur reste, déclaré comme hérité, et l'item se clôt en écarté | effort nul | exclut un seul rendu de schéma dans la maison ; le rapport d'audit garde le dessin sans badges ni ancrage |

> **Si rien n'est décidé** : l'option (c) s'applique de fait, sans clôture — l'item reste en cours et
> le rapport garde l'ancien rendu.

> **D-5 — Par quel chemin les 6 corrections décidées qui vivent chez des produits leur parviennent-elles ?**
>
> Parmi vos décisions, 6 items ne peuvent être corrigés que chez des produits, où le pilot n'écrit
> pas : la porte de fraîcheur de déploiement, les captures en pleine page, les 15 contrôles sans
> recette, les 39 manques d'héritage sur 11 produits, les 14 porteurs de secrets à ranger, et un
> contrôle de transparence cité et inexistant. Aucun lot de travaux n'a été émis pour eux : la recherche de leurs identifiants
> dans le dossier des travaux confiés rend 0 fichier sur 9 cherchés. Un canal existe : le pilot dépose
> un lot de travaux dans la boîte d'entrée du produit, qui l'ingère et décide à sa prochaine ouverture.
>
> **Recommandation : (a).** Source consultée : en-tête de `todo\emettre-travaux.mjs` (décision humaine
> du 25/08 : le pilot n'écrit que dans la boîte d'entrée du produit, ne commite rien chez lui, et le
> lot est jugé avant dépôt) ; relevé d'ouverture de cette session : « aucun mandat déclaré : toute
> écriture chez eux sera refusée ».

| Option | Coût | Exclusions |
|---|---|---|
| (a) je prépare les lots de travaux, 1 par produit concerné, jugés par leur oracle et rangés au pilot ; ils se déposent chez chaque produit à la première session que vous ouvrirez avec un mandat sur lui | effort moyen × moyen | exclut un dépôt immédiat : rien n'entre chez un produit sans mandat déclaré |
| (b) rien n'est émis ; chaque correction attend que le produit soit rouvert pour une autre raison | effort nul | exclut que les produits sachent qu'une correction les attend ; 3 de ces items ont plus de 3 semaines |
| (c) les 6 items sont reclassés en écartés, avec pour critère de réouverture la prochaine version de chaque produit | effort simple × court | exclut de les voir dans ce qui reste à faire ; la rotation des secrets publiés resterait sans porteur |

> **Si rien n'est décidé** : l'option (b) s'applique — les 6 items restent décidés et non faits.

> **D-6 — Les 5 familles de gabarits neuves restent-elles en Markdown seul et au statut « ok » ?**
>
> La campagne a créé 5 familles de documents : kit partenaire, charte de partenariat, courrier
> fournisseur, étude de cas client, mode d'emploi d'un livrable remis en dossier. L'item demandait un
> gabarit, un squelette et une instance ; l'agent a livré le gabarit et une instance remplie en
> Markdown, sans squelette de page, parce que 2 des 5 familles existantes, dont la plus récente, sont
> ainsi faites. Il a posé le statut « ok » en écrivant au catalogue que ces familles naissent d'un
> manque mesuré et non de documents réels.
>
> **Recommandation : (a).** Source consultée : `gabarits\documents\README.md` et la sortie
> d'`oracle-gabarits-documents`, qui écrit que le format du squelette dicte celui de l'instance et
> qu'il n'impose aucun format ; rejeu du pilot : parc en PASS, self-test 29 sur 29.

| Option | Coût | Exclusions |
|---|---|---|
| (a) les 5 familles restent telles que livrées ; le premier document réel de chaque famille confirmera ou corrigera sa forme | effort nul | exclut une page prête à l'emploi pour ces 5 familles ; un document à remettre en page passera par le socle des pages au moment de l'écrire |
| (b) j'ajoute un squelette de page au socle à chacune des 5 familles, jugé par le contrôle des pages | effort moyen × moyen | exclut d'attendre un premier document réel avant de figer une mise en page |
| (c) les 5 familles passent à un statut distinct, « hypothèse », jusqu'à leur premier document réel | effort simple × court | exclut de les compter parmi les familles éprouvées ; l'oracle des gabarits devra connaître ce statut |

> **Si rien n'est décidé** : l'option (a) s'applique — les familles restent en l'état.

## 4. Traité — avec sa preuve

- **La boîte d'entrée des retours ne portait aucun lot en attente, et le poste a été réaligné sur
  GitHub avant toute écriture.**
  - preuve : `node oracles/oracle-boite-entree.mjs` rend `"verdict": "PASS"`, « 119 sidecar(s)
    présent(s), tous ingérés » ; `git pull --ff-only` a amené le pilot à `3d87a2b8`, `git rev-list
    --left-right --count HEAD...origin/main` rendait `0 0`.
- **forge-data, 2 items (TF-1195, TF-1196).** Une réconciliation dit combien d'entités sont en écart
  et combien sont identiques ; la garde du terme proscrit lit la liste des oracles sur le disque.
  Classes : résultat rendu sans dénominateur ; liste écrite à la main qui dérive de son disque.
  - preuve : `b58213f`, `7d55120` ; rejoué par le pilot, `node oracles/self-test.mjs` rend « 362
    PASS, 0 FAIL » (356 au départ).
- **forge-audit, 1 item (TF-1183).** La forme native des expressions d'un rapport Power BI est jugée ;
  le rapport du 17/09 qui n'avait rendu aucun visuel est désormais refusé avant fusion. Classe :
  défaut réel sans contrôle.
  - preuve : `f209679` ; rejoué par le pilot sous Git Bash, `node tools/verifier.mjs` rend « 12/12
    étape(s) … toutes vertes », 141 tests (135 au départ) ; la fixture rouge sort en exit 1.
- **forge-agents, 4 items (TF-1194, TF-1197, TF-1193, TF-1032).** Le générateur d'oracles relit
  l'indentation du fichier qu'il modifie ; 11 oracles de forge-data entrent au registre des oracles ;
  124 espacements recalés sur l'échelle 4 pt (117 annoncés) ; le gabarit du rapport de revue de
  propale est réécrit sur le socle des pages. Classes : outil qui réécrit un fichier entier pour un
  ajout ; oracles absents du registre ; espacements hors échelle dans ce qui se copie ; gabarit hors
  charte. 1 régression trouvée par le rejeu du pilot : l'outil de recalage de l'agent avait réécrit 8
  copies de travail en fins de ligne Windows, git restait muet ; corrigée, avec un cas de banc neuf.
  - preuve : `5d6c716`, `4d5970c`, `c6200ac`, `7c048af`, `bb5c4a1`, `a57662d` ; rejoué par le pilot :
    le self-test de `quality-oracles` rend « 3 échec(s) » sur `bb5c4a1`, puis « PASS (313 contrôles) »
    sur `a57662d` ; le banc du générateur d'oracles rend « PASS (6 contrôles) ».
- **Pilot, 10 items.** La coquille des pages générées passe les 2 contrôles de design de forge-design
  (TF-1162) ; la règle 5 dit ce que le hook fait (TF-1199) ; les 2 derniers volets d'oracle du 08/09
  (TF-0923) ; la mesure du sens rouge des recettes (TF-1082) ; 4 familles de gabarits (TF-1029) ; le
  mode d'emploi d'un livrable remis en dossier, qui dit pourquoi ses choix d'architecture ont été
  faits (TF-1170) ; la fiche de conception d'un document, jugée avant l'écriture (TF-1097) ; le rejeu
  d'une sonde de glossaire contre un résultat attendu daté, et un appelant pour le seul contrôle qui
  n'en avait pas (TF-1084) ; la mesure des dépôts consommateurs avant et après une mise à jour des
  skills (TF-0965) ; le semis de défauts, 5 couvertures prouvées, 0 fausse, 31 classes sans contrôle
  (TF-1079). Classes : défaut porté par un générateur ; règle écrite sans contrôle qui la joue ;
  famille de gabarit manquante ; preuve dont la présence est jugée et jamais la justesse ; règle
  neuve mesurée chez son seul auteur ; contrôle déclaré jamais éprouvé.
  - preuve : `82a39726`, `fecca12d`, `e6e4b469`, `6b996b07`, `7565c8d6`, `86e195b7`, `7df3fd34`,
    `72db1d74`, `40114ddf`, `cdf5af1f`, `a1266c8a` ; rejoué par le pilot : banc de la coquille « 7
    PASS, 0 FAIL » ; `node oracles/self-test.mjs` « 93 PASS, 0 FAIL » (84 au départ) ;
    `lib-sens-rouge.test.mjs` « 15/15 PASS » ; `oracle-gabarits-documents --self-test` « 29/29 PASS »
    (18 au départ) et parc en PASS ; `verifier-sonde-glossaire.test.mjs` « 12 PASS, 0 FAIL » ;
    `consommateurs-skills.test.mjs` « 14 PASS, 0 FAIL » ; `semer-defauts.test.mjs` « 11 PASS, 0
    FAIL » ; `relever-appelants.mjs` « 109 contrôle(s), 0 sans appelant exécutable ».
- **forge-agents et forge-tests, 1 item (TF-1093).** Le contrôle de rendu du socle se joue sur une page
  servie en local, et croise les filtres par paires avec un plafond affiché ; l'adaptateur de
  forge-tests sait le demander. Classe : contrôle joué sur fichier, jamais sur l'instance servie.
  - preuve : `aa89b18`, `9b042dc`, `29fd97b` ; rejoué par le pilot : `self_test.py` du socle rend
    « 440/440 cas passés », exit 0 (419 au départ, mode fichier inchangé) ; le test neuf de
    forge-tests rend 10 passés et 2 skips déclarés, exit 0 ; selon l'agent, la suite complète de
    forge-tests passe de 1378 à 1388 passés, avec le même échec préexistant lié à la copie installée.
- **Le harnais complet du pilot n'a gagné aucun défaut.**
  - preuve : `node oracles/self-tests.mjs`, rejoué par le pilot après les 3 vagues du pilot, rend
    « 2/130 oracle(s) en défaut : scripts/rebatir-clone.test.mjs, oracle-skills.mjs (parc réel) » ;
    les 3 agents du pilot avaient relevé ces 2 mêmes défauts avant toute modification (2 sur 125).
- **Le registre porte les 18 clôtures, chacune avec sa descente, 2 restes, 2 occurrences et 8
  candidats : TF-1244 à TF-1251.** Parmi eux : le conflit entre le contrôle de bascule de thème de
  forge-design et le thème clair strict du socle ; 4 études du 14/09, citées 10 fois par le registre
  comme fondement de décisions, absentes du disque et de l'historique git.
  - preuve : `node todo/journaliser.mjs` a rendu `verdict_avant` PASS et `verdict_apres` PASS à
    chacune des 6 écritures ; `node todo/ingerer-lot.mjs` rend « 8 candidature(s) ingérée(s) en
    CANDIDAT (lot dc2ac1df4483) » ; `node todo/oracle-todo.mjs` rend `"verdict": "PASS"`.
- **La campagne est journalisée.**
  - preuve : entrée du 20/09/2026 (soir) ajoutée à `BOUCLE-AMELIORATION.md`, `git diff --stat` rend
    27 insertions ; enregistrée avec cette synthèse.

## 5. Non traité — avec son motif

- La bascule du schéma de base de données du rapport d'audit (TF-0940) : motif `dependance_bloc_3` —
  attend D-4 ; aucun enregistrement, plan en 8 étapes consigné au registre.
- La publication des 28 enregistrements : motif `dependance_bloc_3` — attend D-2.
- La mise à jour de la copie installée des skills : motif `dependance_bloc_3` — attend D-3.
- Les 6 corrections qui vivent chez des produits (TF-0674, TF-0676, TF-0682, TF-1078, TF-1090,
  TF-1105) : motif `garde_fou` — le pilot n'écrit pas chez un produit ; le chemin attend D-5 ; la
  rotation des identifiants publiés de TF-1090 reste un geste humain.
- Les 3 items du produit de communication et de réseaux sociaux (TF-1031, TF-1159, TF-1160) : motif
  `gate_gouvernance` — l'ouverture d'un run chez un produit est un feu vert humain.
- Les 7 étapes non écrites de la chaîne de traduction et d'audit (TF-1094) : motif
  `dependance_externe` — la décision d'origine interdit de les deviner ; il faut un run réel sur un
  second produit.
- L'activation du circuit de contrôle hébergé du pilot (TF-1018) : motif `gate_gouvernance` — geste
  humain distinct ; déconseillé tant que le harnais porte 2 défauts sur ce poste.
- 4 items suspendus à des décisions posées dans des restitutions antérieures (TF-0963, TF-1023,
  TF-1026, TF-1028) : motif `gate_gouvernance` — elles n'ont pas reçu de réponse ; je ne les repose
  pas ici pour que ce bloc reste tranchable, je les reposerai à votre demande.
- 2 items suspendus (TF-1070, revue du 15/10 ; TF-0549, ouvert par votre choix du 24/08) : motif
  `dependance_externe` — rien à faire aujourd'hui.
- Les 53 candidats du registre, dont les 8 de ce tour : motif `hors_mandat` — périmètre que vous
  avez choisi ; ils attendent vos décisions.
- 2 défauts du harnais antérieurs à la campagne : motif `hors_mandat` — la recette de reconstruction
  d'un clone échoue sur ce poste (occurrence notée sur le candidat TF-1231), le contrôle des skills
  sur le parc réel suit D-3.
- Des fichiers d'autres sessions, non suivis par git et laissés intacts : un rapport d'audit et son
  plan d'actions dans la boîte d'entrée des retours, qui ne sont pas un lot ; un dossier
  `brag-output` ; une synthèse « Video » du 19/09 et ses fichiers de verdict : motif `hors_mandat`.

## 6. Écarts à la lettre

- **Vous avez demandé** de traiter tous les todos. **J'ai traité** les 36 items décidés ou en cours,
  pas les candidats. **Pourquoi** : c'est le périmètre que vous avez choisi à la question d'ouverture.
- **Vous avez répondu** que la synchronisation était faite. **J'ai trouvé** le pilot en retard de 3
  enregistrements et bloqué par 2 index générés ; je les ai restaurés, puis j'ai tiré en avance
  rapide. **Pourquoi** : la règle de fraîcheur interdit tout run sur un poste non prêt.
- **5 familles de gabarits** livrées en Markdown sans squelette de page : objet de D-6.
- **TF-1199 demandait de décider** si les sceaux de synthèse se suivent. **La règle écrite** suit
  l'état de fait, 23 sceaux déjà suivis. **Pourquoi** : l'inverse aurait contredit le dépôt ;
  réversible.
- **TF-0923 demandait** le refus d'une proposition sans page. **Livré** sur 4 rôles de documents.
  **Pourquoi** : votre décision du 16/09 y a fait entrer les études.
- **TF-1079 visait** 10 à 20 classes semées. **Livré** : 5. **Pourquoi** : la plupart des contrôles du
  pilot jugent le parc, pas un document fabricable ; 49 motifs écrits, aucune instance de complaisance.
- **TF-0965 demandait** que la propagation mesure ses consommateurs. **Livré** pour la propagation
  délibérée ; celle de l'ouverture de session déclare son raccourci. **Pourquoi** : jusqu'à 20
  minutes par ouverture ; l'arbitrage vous reste ouvert.
- **J'ai enregistré localement** sans vous le demander, 7 fois. **Pourquoi** : règle du projet,
  enregistrement local dès l'écriture, publication sur votre feu vert.
- **J'ai transmis à un agent une cause fausse** pour la régression, en la marquant comme inférence ;
  il l'a réfutée par mesure. Aucune écriture n'en a découlé.

## 7. Risques

- **L'autre poste publie pendant que ces 28 enregistrements restent locaux.**
  - signal : le relevé d'ouverture affiche « DIVERGÉ », ou `git push` rend « rejected ».
  - parade : D-2 (a) ; `git fetch` juste avant toute publication, rejeu par-dessus.
- **La forge des tests mesure désormais réellement 2 pans qui ne mesuraient rien** : le chargeur de
  mesure rendait un gabarit non évaluable, l'agent l'a réparé.
  - signal : des constats de contraste ou de plancher neufs sur un produit au prochain audit.
  - parade : ce sont des constats vrais jusque-là avalés ; l'écart est déclaré ici et au rapport.
- **4 décisions du 14/09 reposent sur des études introuvables.**
  - signal : un agent ou un lecteur ouvre le chemin cité et ne trouve rien.
  - parade : candidat TF-1248 ; chercher d'abord sur l'autre poste et dans les sauvegardes.
- **Un agent ne rejoue pas le self-test des skills qui consomment celui qu'il modifie.**
  - signal : un self-test sans échec chez l'agent, en échec au rejeu du pilot, comme ce soir.
  - parade : consigne ajoutée à la main aux agents suivants ; elle n'est pas au gabarit, l'occurrence
    est notée sur le candidat TF-1224.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, dans l'ordre où je recommande de les débloquer —
la publication avant tout, parce que l'autre poste travaille ; puis vos actions.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier les 5 dépôts : `git fetch`, rejeu si l'autre poste a publié, porte des noms, `git push`, relevé `node bootstrap.mjs --pull` | `auto_ia` | neuve | `dependance_bloc_3` — attend D-2 (a) ou (c) | 28 enregistrements ne vivent que sur ce poste |
| **A-2** | Mettre à jour la copie installée des skills par `node oracles/oracle-skills.mjs --appliquer`, consommateurs mesurés avant et après | `auto_ia` | neuve | `dependance_bloc_3` — attend D-3 (a) ou (b) | ce poste exécute des skills en retard de 5 modifications |
| **A-3** | Basculer le schéma du rapport d'audit sur le canevas, en commençant par mettre le rendu actuel sous contrôle avec la fixture riche | `auto_ia` | TF-0940 | `dependance_bloc_3` — attend D-4 (a) ou (b) | le rapport d'audit garde l'ancien dessin |
| **A-4** | Préparer 1 lot de travaux par produit concerné avec `node todo/emettre-travaux.mjs`, jugé avant dépôt | `auto_ia` | TF-0674 | `dependance_bloc_3` — attend D-5 (a) ; le dépôt chez un produit attend en plus un mandat déclaré | 6 corrections restent inconnues des produits |
| **A-5** | Ajouter un squelette de page aux 5 familles de gabarits neuves | `auto_ia` | TF-1029 | `dependance_bloc_3` — ne se fait que sur D-6 (b) | rien : l'option (a) est le repli |
| **A-6** | Trancher D-2 à D-6 — répondre par exemple « D-2 (a), D-3 (a), D-4 (a), D-5 (a), D-6 (a) » | `manuelle_utilisateur` | neuve | `decision` — publier, propager, choisir une conception et un canal vers les produits sont des arbitrages humains | les replis s'appliquent : tout reste local et 18 items restent ouverts |
| **A-7** | Décider les candidats du registre — répondre « décide TF-1244 » pour chacun de ceux que vous retenez ; la liste est dans `todo\TODO.md` | `manuelle_utilisateur` | neuve | `decision` — seul un mandat humain fait passer un candidat en décidé | 53 candidats attendent, dont 2 majeurs entrés ce soir (TF-1244, TF-1248) |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme. Les points d'étape du
  tour : `output\04-plans\Digit-AI - Synthese Mandat - Campagne des todos et retours premiere vague lancee - 20260920d.md`.
- Enregistrements locaux, aucun publié — forge-data : `7d55120`, `b58213f` ; forge-audit : `f209679` ;
  forge-agents : `5d6c716`, `4d5970c`, `c6200ac`, `7c048af`, `bb5c4a1`, `a57662d`, `aa89b18`,
  `9b042dc` ; forge-tests : `29fd97b` ; pilot : `82a39726`, `fecca12d`, `e6e4b469`, `6b996b07`,
  `827d7f6c`, `7565c8d6`, `86e195b7`, `7df3fd34`, `72db1d74`, `02db01ab`, `40114ddf`, `db334682`,
  `cdf5af1f`, `a1266c8a`, `8edd107c`, `0695e76d`, puis l'enregistrement de cette restitution.
- Registre : `todo\TODO.jsonl` — 18 clôtures, 2 restes, 2 occurrences, 8 créations ; à l'arrivée 9
  décidés, 9 en cours, 53 candidats. Lot de candidatures :
  `input\01-candidatures\constats-campagne-20260920c.tf.jsonl`.
- Journal : `BOUCLE-AMELIORATION.md`, entrée du 20/09/2026 (soir).
- Aucune page HTML livrée dans ce tour.
