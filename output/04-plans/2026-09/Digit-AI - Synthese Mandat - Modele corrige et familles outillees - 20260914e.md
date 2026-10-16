---
destinataire: humain
---

# Synthèse de mandat — le modèle de référence est corrigé et prouvé, trois familles sont outillées, et dix ne l'ont pas été pour des raisons que je peux nommer (14/09/2026)

Vos deux arbitrages sont exécutés, et je dois commencer par une correction : au tour précédent je vous ai dit qu'il restait douze familles démunies, il y en avait treize. Le chiffre juste est au catalogue, et je l'ai vérifié avant d'écrire cette phrase. Sur le fond, le modèle de rapport de données est corrigé — ses six chapitres partagent désormais une seule largeur — et la preuve tient en une ligne : la sonde qui trouvait deux défauts sur quarante et une pages n'en trouve plus aucun sur quarante-trois. Le défaut que vous aviez signalé le 11 septembre était hérité, pas accidentel. Sur les treize familles démunies, trois avaient une source réellement atteignable et sont maintenant outillées, page vide et exemplaire rempli, toutes vertes. Les dix autres ne l'ont pas été, et je ne les ai pas inventées : pour cinq d'entre elles, le skill qui possède leur contenu refuse par écrit qu'on leur fige une forme, avec un argument ; pour quatre, les seuls documents dont on pourrait les extraire ne sont pas sur ce poste ; pour la dernière, la couverture qu'annonçait le catalogue s'est révélée fausse à la vérification. Chaque raison est écrite au catalogue et ouverte au registre. Ce qui est attendu de vous : trancher la contradiction qui bloque les cinq premières.

## 1. En-tête d'identification

- **quoi** — exécution des décisions humaines D-8 (a) et D-9 (a) du 14/09/2026 : correction du modèle de rapport de données, puis traitement des familles déclarant produire des pages web et dépourvues de point de départ.
- **sur quoi** — le pilot `digit-ai-factory` : bibliothèque de gabarits, catalogue, registre. Le socle `digit-ai-page-html` et le skill `pilote-de-mission` ont été **lus seulement**.
- **quand** — 2026-09-14 14:00 CEST (UTC+02:00), durée ≈ 45 min, relevée à l'horloge du poste.
- **qui** — pilot `digit-ai-factory`, branche `claude/html-quality-new-formats-qhfgvj`, enregistrement `385b1ae` ; oracles exécutés : `check_html.py` (41 règles, empreinte `6d1f8858afdf`), `render_page.py` (27 familles), `check_markdown.py`, `oracle-gabarits-documents.mjs`, dont G1 — une famille porte sa doctrine et au moins un exemplaire, G2 — l'exemplaire est rempli, G3 — le marquage passe le contrôle du socle, G4 — le document rend son gabarit et sa version, et G5 — le point de départ est déclaré et son chemin vérifié sur disque — et `oracle-todo.mjs`.

## 2. Verdict en une ligne

Le modèle `gd-rapport-donnees` est porté en **1.1.0** — `.lire` retiré de ses **trois** sections bridées, squelette et exemplaire — et la correction est prouvée par la sonde qui avait trouvé le défaut : **2 constats V19 — la largeur de contenu mélangée entre sections — sur 41 pages avant, 0 sur 43 après**, et zéro V20 — une information qui lève un doute, invisible au repos ; TF-1038 décidé puis **clos** `corrige` avec sa descente. Sur les **13** familles démunies — et non 12, chiffre que j'avais donné faux — **3 sont outillées** : `diagnostic-exploitation`, `note-de-synthese`, `synthese-executive`, chacune avec squelette, exemplaire et doctrine, `check_html` rendant **« Aucun problème détecté »** sur les six pages, `render_page` PASS à 1920 px, `oracle-gabarits-documents` PASS G1-G5. Les **10 restantes** ne sont pas inventées : chacune porte au catalogue son **motif écrit** (champ `motif_aucun`, catalogue en **1.3.0**), et trois constats sont ouverts — **TF-1078** (cinq familles attendent une forme que leur skill propriétaire refuse d'écrire, avec un argument : deux textes du parc se contredisent), **TF-1079** (le statut `porte_ailleurs` de `dashboard-tests` est infondé, vérifié), **TF-1080** (quatre familles n'ont pour sources que des livrables client absents de ce poste). Couverture : **4 → 7 squelettes**, **13 → 10** sans point de départ, et **aucun « aucun » n'est plus muet**. `oracle-todo` PASS.

## 3. Décisions attendues de l'humain

> **D-10 — Qui écrit la forme des cinq artefacts de cadence : la bibliothèque, ou personne ?**
>
> Cinq familles — revue des risques, rapport d'avancement, compte rendu de réunion, retour d'expérience de fin de mission, suivi des bénéfices — tirent leur contenu du skill de pilotage de mission, qui décrit précisément ce que chacune doit porter. Mais ce même skill écrit noir sur blanc qu'il ne prescrit aucun gabarit de mise en forme, au motif qu'un gabarit figé serait un objet durable de plus sans juge. La bibliothèque, elle, les déclare comme produisant des pages web et attend donc une forme. Les deux positions se tiennent, aucune ne cède, et les cinq familles restent entre les deux.
>
> **Recommandation : (a).** Source consultée : `gabarits/documents/synthese-executive/GABARIT.md`, écrit ce jour — la même division du travail vient d'être appliquée avec succès à la synthèse exécutive, dont le contrat de contenu reste chez `digit-ai-forge-audit` pendant que la bibliothèque fournit la page. L'argument du skill vise un gabarit qui prescrirait le fond ; il ne vise pas une page qui n'en prescrit aucun.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** La bibliothèque écrit la forme, le skill garde le fond | complexité moyenne × durée moyenne ; cinq familles à produire | exclut que la forme se plie au client au cas par cas, ce que le skill défend |
| **(b)** Les cinq familles cessent de déclarer produire des pages web | complexité simple × durée courte | exclut toute page chartée pour ces artefacts : ils resteront rédigés à blanc, au format de celui qui les écrit |
| **(c)** Laisser la contradiction ouverte | rien | exclut le déblocage : les cinq familles restent démunies, et le constat se rejouera au prochain balayage |

*Si rien n'est décidé* : (c) s'applique — le constat reste au registre avec ses deux citations, et rien ne bouge.

> **D-11 — Que fait-on des cinq familles dont la source n'est pas sur ce poste ?**
>
> Quatre familles n'ont pour sources que des livrables client, absents d'ici, et une cinquième annonçait être couverte par une forge qui ne porte en réalité aucun gabarit de page. Les extraire depuis ce poste reviendrait à inventer leur doctrine, ce que la bibliothèque s'interdit explicitement. Elles peuvent être traitées depuis un poste qui porte les documents, ou reclassées.
>
> **Recommandation : (b).** Source consultée : `gabarits/documents/README.md` — « un gabarit sans livrable réel derrière est une invention, pas une extraction », et la règle qui commande de chercher le générateur avant de conclure au manque. Reclasser dit la vérité tout de suite ; extraire ailleurs la dit plus tard et mieux.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Les extraire depuis un poste qui porte les livrables client | complexité moyenne × durée moyenne, sur un autre poste | exclut un résultat dans ce fil : rien ne bouge ici |
| **(b)** Marquer au catalogue qu'elles attendent un poste porteur, et le rendre mesurable | complexité simple × durée courte | exclut leur outillage : elles restent démunies, mais plus silencieusement |
| **(c)** Les laisser en l'état, avec leur seul motif écrit | rien de plus | exclut toute distinction entre une dette de travail et une dépendance d'environnement |

*Si rien n'est décidé* : (c) s'applique — les motifs restent au catalogue, lisibles, et le constat au registre.

## 4. Traité — avec sa preuve

- **Une erreur de chiffre commise au tour précédent, corrigée — contrôle rouge → vert rejoué, et la classe nommée.**
  - preuve : j'avais écrit « douze familles déclarant produire des pages web restent sans point de départ » ; l'extraction rejouée sur `gabarits/documents/catalogue.jsonl` rendait **13**. Le chiffre venait d'une soustraction faite de tête (14 moins la famille outillée) au lieu d'une lecture du catalogue. Classe du défaut : un compte annoncé sans rejouer la mesure qui le produit — la même classe que l'erreur du matin sur le balayage des points de départ.
- **Le modèle `gd-rapport-donnees` est corrigé — contrôle rouge → vert rejoué par l'instrument même qui avait trouvé le défaut, et la classe nommée : un défaut de composition hérité du gabarit de référence.**
  - preuve : `.lire` retiré de **3** sections dans `SQUELETTE.html` et dans `INSTANCE.html`, version portée en **1.1.0** dans les deux fichiers et dans `GABARIT.md` ; sonde `render_page.py` sur les pages livrables du parc — **avant : `{"lues": 41, "V19": 2}`**, les deux sur cette famille ; **après : `{"lues": 43}`**, zéro V19 et zéro V20.
- **La cause est écrite là où un producteur la lira, pas seulement au registre.**
  - preuve : `gabarits/documents/rapport-de-donnees/GABARIT.md`, section « 1.1.0 (14/09/2026) — une seule largeur de contenu », qui porte la mesure (six sections sœurs, 1 080 px contre 1 350 px à 1920 px de fenêtre), la citation du retour du 11/09, et la règle qui le tient désormais. `check_markdown.py` rend PASS.
- **Les treize familles démunies ont été mesurées une par une, jamais estimées.**
  - preuve : test d'existence joué sur chaque source citée au catalogue → **3 familles ont au moins une source atteignable** (`diagnostic-exploitation`, `note-de-synthese`, `synthese-executive`), **10 n'en ont aucune** sur ce poste.
- **Trois familles sont outillées, et chacune naît conforme aux trois règles de composition posées ce matin.**
  - preuve : `check_html.py` rend `Verdict : PASS` **et « Aucun problème détecté »** — ni échec, ni avertissement — sur les six pages produites ; `render_page.py` rend `Verdict : PASS` à 1920 px sur les six ; `oracle-gabarits-documents.mjs` rend PASS avec G1 à G5 verts. Aucune section ne porte `.lire` — ce que V19 mesure — et aucun ensemble n'est énuméré deux fois, ce que L32 — un même ensemble n'est énuméré qu'une fois par page — interdit.
- **Les deux doctrines manquantes ont été écrites, parce que l'oracle les a exigées.**
  - preuve : premier passage `G1 FAIL ×2` — « pièce(s) manquante(s) : GABARIT.md » sur `note-de-synthese` et `synthese-executive` ; après écriture des deux doctrines, `oracle-gabarits-documents` rend PASS. La doctrine de `synthese-executive` déclare explicitement que le **fond** reste chez `digit-ai-forge-audit` et que la bibliothèque ne fournit que la **forme**.
- **Les dix familles non traitées portent chacune son motif, au catalogue et non dans un commentaire.**
  - preuve : champ `motif_aucun` posé sur les dix entrées, catalogue porté en **1.3.0** ; contrôle rejoué → `aucun SANS motif : 0`.
- **Trois constats ouverts plutôt qu'une invention.**
  - preuve : `node todo/journaliser.mjs` → 5 événements, `verdict_avant: PASS -> verdict_apres: PASS` ; TF-1078 (la contradiction, avec les deux citations opposées), TF-1079 (`porte_ailleurs` infondé, vérifié par `find` sur le dépôt), TF-1080 (sources client absentes). Vues régénérées : `TODO.md` 298 actifs.
- **La contradiction de TF-1078 est citée des deux côtés, pas résumée.**
  - preuve : `pilote-de-mission/references/artefacts-de-cadence.md` porte la table des cinq artefacts avec leur régime de preuve **et** la phrase « Elle ne prescrit pas de gabarit de mise en forme […] Un gabarit de présentation figé aurait été un objet durable de plus, sans juge » ; le catalogue déclare les mêmes cinq familles en `formats: [html]`.
- **Le statut `porte_ailleurs` de `dashboard-tests` est infondé, et c'est vérifié et non supposé.**
  - preuve : `find /home/user/digit-ai-forge-tests -iname "*.html"` ne rend que des fixtures de banc rouge sous `fixtures/banc-rouge/dist/`, aucun gabarit ni générateur de tableau de bord.
- **La recette complète du pilot ne perd rien : aucun défaut neuf.**
  - preuve : `node oracles/self-tests.mjs` après les six pages neuves et la correction du modèle rend **13 oracles en défaut sur 107** — liste identique, au nom près, à celle mesurée avant ce tour.
- **Travail enregistré et publié.**
  - preuve : enregistrement `385b1ae` poussé sur `claude/html-quality-new-formats-qhfgvj`.

## 5. Non traité — avec son motif

- **Les cinq familles d'artefacts de cadence** — motif : bloqué par une contradiction écrite entre deux textes du parc, non arbitrée ; écrire leur forme irait contre une position argumentée du skill propriétaire. C'est l'objet de la décision D-10.
- **Les quatre familles dont les sources sont des livrables client** — motif : impossible à prouver ici, les documents ne sont pas sur ce poste, et le README de la bibliothèque interdit d'extraire sans livrable réel derrière. C'est l'objet de la décision D-11.
- **`dashboard-tests`** — motif : écarté avec son critère de réouverture — sa couverture annoncée est fausse, et le reclassement appartient à l'arbitrage de TF-1079.
- **Le socle n'est toujours pas publié** — motif : accès, éprouvé au tour précédent — `git push` sur `digit-ai-forge-agents` rend une erreur HTTP 403 du relais.
- **La demande de fusion reste en brouillon** — motif : dépendance à une décision humaine.

## 6. Écarts à la lettre

*Comment lire ce tableau* : votre texte à gauche, ce que j'ai fait au milieu, le motif à droite. Un « non » sur une ligne annule cette ligne seule.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « 8a » — corriger le modèle : une seule largeur pour toutes ses sections | Fait, et la version du gabarit portée de 1.0.0 à 1.1.0 | Conforme à la lettre. **La montée de version est un ajout** : sans elle, un document produit hier et un produit demain se réclameraient du même gabarit |
| « 9a » — traiter **les douze** familles restantes | J'en ai traité **trois** sur **treize** | Deux écarts en un. D'abord le chiffre : il y en avait treize, je vous en avais annoncé douze à tort. Ensuite le périmètre : dix ne sont pas extractibles ici, et **je ne les ai pas inventées** — le README de la bibliothèque l'interdit en toutes lettres. **Restriction assumée**, avec le motif de chacune écrit au catalogue et trois constats ouverts |
| (non dit) | J'ai écrit deux doctrines (`GABARIT.md`) que vous n'aviez pas demandées | L'oracle les a exigées : un squelette sans sa doctrine est une demi-famille, et G1 le refuse. **Écriture ajoutée** au périmètre |
| (non dit) | J'ai ajouté un champ `motif_aucun` au catalogue | Sans lui, un « aucun » non instruit ne se distingue pas d'un « aucun » mesuré. **Ajout au schéma** que vous n'aviez pas commandé |

## 7. Risques

- **Les dix familles restent démunies indéfiniment parce que leur motif les fait paraître réglées.**
  - signal : au prochain balayage, quelqu'un lit « motif écrit » et conclut que le sujet est traité.
  - parade : les trois constats sont ouverts au registre avec leur mesure, et un candidat ouvert n'est pas un sujet clos ; la revue du 15 octobre porte la question du nombre de familles outillées.
- **La correction du modèle change l'allure de tout rapport de données à venir, et quelqu'un la conteste.**
  - signal : un lecteur trouve la prose trop large sur un rapport produit après aujourd'hui.
  - parade : l'exception existe et se déclare — `data-largeur-exception` avec son motif — et la raison de la correction est écrite dans le gabarit, avec le retour du 11/09 cité.
- **La contradiction de TF-1078 est tranchée sans que le skill propriétaire soit consulté.**
  - signal : les cinq formes sont écrites, et un retour de `pilote-de-mission` les refuse.
  - parade : le constat nomme les deux positions avec leurs citations, et la décision D-10 est posée à vous plutôt qu'exécutée — c'est exactement pourquoi je ne les ai pas écrites.
- **Les trois nouveaux exemplaires portent des données inventées qu'on prend pour des faits.**
  - signal : quelqu'un cite un chiffre de l'exemplaire de `diagnostic-exploitation` comme une mesure réelle.
  - parade : les trois exemplaires portent un client pseudonymisé et des mesures cohérentes entre elles mais explicitement illustratives ; c'est la nature d'un exemplaire, et la doctrine de la bibliothèque interdit toute donnée client dans un gabarit.

## 8. Prochaines actions

*Comment lire ce tableau* : une ligne par action, l'acteur en colonne, les actions exécutables par l'IA en tête par le tri ; la dernière colonne dit ce qu'il en coûte de ne pas la faire. L'ordre est dérivé : d'abord ce qui débloque une décision, ensuite ce qui en dépend, enfin ce qui attend une date. Les sélecteurs `A-N` désignent des actions et ne partagent aucune numérotation avec les décisions `D-N` du bloc 3 ; la numérotation continue celle des restitutions précédentes de ce jour.

| # | Action | Acteur | État / motif | Si elle n'est pas faite |
|---|---|---|---|---|
| **A-26** | Répondre `D-10` et `D-11` par leur lettre — par exemple « D-10 a, D-11 b » | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, arbitrer entre deux textes du parc qui se contredisent, et choisir le sort de familles dépendant d'un autre poste, vous appartiennent. Fichier à lire d'abord : `gabarits/documents/synthese-executive/GABARIT.md`, qui montre la division du travail proposée | les options par défaut (c) et (c) s'appliquent : dix familles restent démunies et la contradiction se rejouera au prochain balayage |
| **A-27** | Publier l'enregistrement `d75d76e` du socle depuis un poste autorisé sur `digit-ai-forge-agents` | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `acces` — tentative jouée le 14/09 : `git -C /home/user/digit-ai-forge-agents push origin main` rend `access denied by the git proxy […] not in this session's authorized repository set`, erreur HTTP 403 | les trois règles de composition ne vivent que sur ce poste, et tout autre poste juge encore avec 40 règles |
| **A-28** | Sortir la demande de fusion du brouillon, ou demander le retrait de la branche | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, la fusion engage la branche principale. Écran : `https://github.com/iguane39/digit-ai-factory/pull/1`, bouton « Ready for review » | tout le travail des cinq tours reste sur une branche latérale |
| **A-29** | Écrire la forme des cinq artefacts de cadence, le fond restant chez le skill de pilotage | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend D-10 (option (a)) | cinq familles restent démunies, et le contrat de contenu existant ne produit aucune page |
| **A-30** | Marquer au catalogue les familles qui attendent un poste porteur, et rendre la distinction mesurable | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend D-11 (option (b)) | une dépendance d'environnement continue de se lire comme une dette de travail |
| **A-31** | Décider le sort des candidats TF-1075 à TF-1080 | auto_ia | action `neuve`, **non exécutée** — motif : `gate_gouvernance`, le passage de candidat à décidé exige un décideur humain nommé et sa date | six constats restent en attente, et le compteur de récidives les ignore |
| **A-32** | Tenir la revue datée : familles outillées, constats produits par L32, V19 et V20, retours humains par famille | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_externe`, la date du 2026-10-15 n'est pas atteinte | le verdict de l'étude n'est jamais confronté aux faits |

Chaque action se déclare `neuve` : aucune ne porte d'identifiant du registre produit, les items ouverts ce jour étant des items de forge.

## 9. Traces

- `gabarits/documents/rapport-de-donnees/` — `SQUELETTE.html`, `INSTANCE.html` et `GABARIT.md` en 1.1.0 ; une seule largeur de contenu.
- `gabarits/documents/diagnostic-exploitation/`, `note-de-synthese/`, `synthese-executive/` — squelette, exemplaire et doctrine ; `check_html` sans un seul avertissement, `render_page` PASS, G1-G5 PASS.
- `gabarits/documents/catalogue.jsonl` — 1.3.0 ; 7 squelettes, 2 générateurs, 1 jeu de canevas, 10 sans point de départ, chacun avec son `motif_aucun`.
- `todo/TODO.jsonl`, `todo/TODO.md`, `todo/TODO.html`, `todo/RECIDIVES.md` — TF-1038 clos avec sa descente ; TF-1078, TF-1079 et TF-1080 ouverts ; `oracle-todo` PASS.
- Enregistrement `385b1ae` sur `claude/html-quality-new-formats-qhfgvj`, poussé ; `https://github.com/iguane39/digit-ai-factory/pull/1` en brouillon, surveillée.
- **Les six pages HTML citées comme livrées dans ce tour** portent le verdict de la critique d'implémentation : **non jouée**, faute de mandat forge-design ; les deux oracles du socle sont verts sur les six, et ce n'est pas la même chose, donc c'est dit plutôt que tu.
