---
destinataire: humain
---

# Synthèse de mandat — vos trois arbitrages sont exécutés, l'étude est rendue, et elle vous donne partiellement tort (14/09/2026)

Vos trois choix ont été suivis à la lettre et l'étude d'opportunité est produite, jugée et publiée. Elle confirme le manque que vous pressentiez — sur vingt familles de livrables qui annoncent produire des pages web, quatorze ne donnent au rédacteur aucun point de départ — mais elle déplace la cause que vous aviez désignée. Les quatre documents dont la qualité a été mise en défaut depuis une semaine appartiennent tous à des familles **déjà outillées**, y compris celui que votre commanditaire a désigné comme le standard le 9 septembre et qui échoue le contrôle de son propre générateur. L'outil ne manquait pas : il se taisait sur ce qui se combine avec quoi. Je dois aussi vous signaler une erreur que j'ai commise puis corrigée en cours de route : mon premier comptage annonçait dix-sept familles démunies, il se trompait sur trois d'entre elles, et cette erreur est devenue le premier constat de l'étude parce que sa cause est structurelle. Ce que ça change pour vous : la séquence retenue commence par un geste de complexité simple et de durée courte, pas par quatorze pages à écrire. Ce qui est attendu de vous : deux arbitrages, l'un sur l'ouverture des constats au registre, l'autre sur le lancement du premier palier.

## 1. En-tête d'identification

- **quoi** — exécution des trois décisions humaines du 14/09/2026 : production de l'étude d'opportunité commandée par le prompt analysé le matin même, périmètre étendu à toutes les familles HTML sans point de départ, ordonnées par usage réel.
- **sur quoi** — le pilot `digit-ai-factory` ; catalogue `gabarits/documents/`, registre `todo/`, socle `digit-ai-page-html` v1.21.0, et trois dépôts frères consultés **en lecture seule** (`digit-ai-forge-audit`, `digit-ai-forge-tests`, `digit-ai-forge-data`).
- **quand** — 2026-09-14 10:05 CEST (UTC+02:00), durée ≈ 30 min, relevée à l'horloge du poste.
- **qui** — pilot `digit-ai-factory`, branche `claude/html-quality-new-formats-qhfgvj`, enregistrement `47d2bea` ; oracles exécutés : `oracle-etude-opportunite.mjs`, dont les dix contrôles vont de E1 (les cinq sections du gabarit sont présentes) à E10 (le test rétro est joué), et `check_markdown.py` du socle, règles M7 (un chapitre ouvre par ce que le lecteur va y apprendre), M10 (tout tableau dit comment le lire), M14 (aucun marqueur de travail resté dans le texte) et M18 (tout identifiant porte sa glose à sa première occurrence).

## 2. Verdict en une ligne

**Étude d'opportunité produite et jugée `PASS` par `oracle-etude-opportunite.mjs` (10/10, de E1 sections du gabarit à E10 test rétro) et par `check_markdown.py` sur ses quatre règles de lisibilité (1 avertissement M14 légitime sur un document qui parle du registre de tâches) ; mesure d'avant établie par extraction mécanique rejouable — sur 32 familles du catalogue, 20 déclarent `html`, réparties en 3 squelettes statiques, 2 générateurs, 1 jeu de canevas de skill et 14 sans aucun point de départ vérifié ; arbitrage des deux hypothèses PARTIEL et déclaré comme tel — les 4 documents repris depuis le 08/09 (TF-1036, TF-1038, TF-1051, et l'entrée `rapport-audit-poc-to-prod` du catalogue dont le fichier désigné standard le 09/09 rend exit 1 et 13 erreurs) appartiennent tous à des familles outillées, et les classes « l'outil était là » cumulent 34 items contre 13 pour « il manquait un gabarit », donc l'hypothèse du silence l'emporte sur la qualité tandis que celle du manque reste NON DÉMONTRÉE sur le coût de démarrage, biais de sélection écrit ; verdict unique O4 (déclarer d'abord, régler la composition ensuite, outiller les familles enfin) en trois paliers mesurés, plan de revue daté au 2026-10-15 ; une erreur de mesure commise puis corrigée en cours d'étude et consignée comme premier constat ; 1 enregistrement poussé, aucune écriture hors `output/`.**

## 3. Décisions attendues de l'humain

> **D-4 — Est-ce que j'ouvre maintenant les quatre constats au registre des améliorations, ou est-ce que j'attends un mandat de registre ?**
>
> L'étude a produit quatre constats qui ne vivent aujourd'hui que dans son texte : le catalogue ne porte aucun champ disant où vit le point de départ d'une famille ; trois règles de composition manquent au socle ; le statut « extrait et jugé » ne dit rien du format de sortie, ce qui masque deux familles ; et les familles démunies sont invisibles aux contrôles, donc leur coût réel reste immesurable. Tant qu'ils ne sont pas au registre, ils ne sont ni comptés, ni comparables aux autres candidats, ni suivis.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` § TODO-FORGE — « tout entre en candidat, décision humaine, clôture sur gains constatés » ; un constat qui reste hors registre n'a pas d'existence pour la boucle d'amélioration, et le premier des quatre est précisément celui qui rend la mesure possible.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Ouvrir les quatre constats en candidats maintenant | complexité simple × durée courte ; quatre entrées de plus à arbitrer | exclut de les regrouper en un seul candidat, donc un arbitrage global |
| **(b)** Attendre un mandat de registre dédié | rien dans l'immédiat | exclut leur comptage : ils restent dans un document que rien ne relit |
| **(c)** N'ouvrir que le premier, celui du champ de catalogue | complexité simple × durée courte | exclut les trois autres, dont les règles de composition qui portent le verdict de l'étude |

*Si rien n'est décidé* : (b) s'applique — les constats restent dans l'étude, lisibles et sourcés, mais hors du compteur.

> **D-5 — Est-ce que je lance le premier palier maintenant, ou est-ce que l'étude s'arrête à sa recommandation ?**
>
> Le premier palier de la séquence retenue consiste à déclarer, pour chacune des vingt familles qui annoncent produire des pages web, où vit son point de départ et de quel type il est, puis à poser le contrôle qui vérifie cette déclaration sur disque. C'est le geste dont l'absence m'a fait compter faux ce matin. Il ne produit aucune page et ne corrige aucun défaut visuel : il rend seulement la question décidable à la machine.
>
> **Recommandation : (a).** Source consultée : `output/03-etudes/20260914-etude-opportunite-premiers-html-nouveaux-formats.md` § 5, où ce palier est chiffré en complexité simple × durée courte et où il conditionne les deux suivants — le palier trois est explicitement borné à trois familles tant que la mesure qu'il produit n'existe pas.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Lancer le premier palier | complexité simple × durée courte ; un champ de plus à tenir et un contrôle de plus à la recette | exclut de commencer par les pages elles-mêmes, donc tout bénéfice visible immédiat |
| **(b)** S'arrêter à l'étude | rien de plus | exclut la mesure du 15 octobre : sans déclaration, la revue prévue n'aura rien de neuf à confronter |
| **(c)** Sauter au troisième palier et écrire les premiers points de départ | complexité moyenne × durée moyenne | exclut la séquence recommandée, et reproduit la condition mesurée comme la plus faible par l'état de l'art |

*Si rien n'est décidé* : (b) s'applique — l'étude vous reste acquise, et le rendez-vous du 15 octobre se tiendra sans matière neuve.

## 4. Traité — avec sa preuve

- **Vos trois arbitrages exécutés tels que rendus** : « modèle » fixé au gabarit d'une famille, étude complète lancée, périmètre étendu à toutes les familles démunies **et** ordonné par usage réel.
  - preuve : l'étude porte en tête la phrase « son périmètre couvre toutes les familles HTML sans point de départ, ordonnées par usage réel, les premières d'abord », et sa section 0 bis range les 14 familles du rang 1 au rang 14.
- **Étude d'opportunité produite au gabarit et jugée.**
  - preuve : `node oracles/oracle-etude-opportunite.mjs` → `VERDICT: PASS`, **10/10** sur les dix contrôles du gabarit ; `python3 ~/.claude/skills/digit-ai-page-html/scripts/check_markdown.py` → `Verdict : PASS` sur ses quatre règles, 1 avertissement (marqueur de travail) sur une occurrence du mot « TODO » qui désigne le registre de la maison.
- **Mesure d'avant établie, par extraction mécanique rejouable et non par lecture.**
  - preuve : script d'extraction sur `gabarits/documents/catalogue.jsonl` plus test d'existence sur disque → 20 familles déclarant `html` sur 32 ; 3 squelettes statiques (`rapport-de-donnees`, `dossier-exploitation`, `dossier-architecture-technique`), 2 générateurs (`build-fiche.mjs`, `build-rapport.mjs`), 1 jeu de canevas (`digit-ai-schemas`, 7 gabarits plus `exemple-reference.html`), 14 sans point de départ ; contrôle de somme `20 = 3 + 2 + 1 + 14`.
- **Erreur de mesure commise, détectée et corrigée — contrôle rouge → vert rejoué, et la classe du défaut nommée** : mon premier balayage annonçait 17 familles démunies, le chiffre juste est 14.
  - preuve, contrôle **rouge → vert** : le balayage initial ne testait que l'existence d'un fichier `SQUELETTE.html` et rendait `17 nues` ; un deuxième balayage élargi rendait `8 générateurs`, faux dans l'autre sens parce qu'il prenait `render_page.py` — un oracle — pour un générateur ; le balayage retenu, qui cherche le générateur dans les seules sources et exclut les noms d'oracles, rend `3 + 2 + 1 + 14 = 20` avec son contrôle de somme. Classe du défaut, nommée plutôt que le seul symptôme : la reconnaissance d'un artefact par recherche de sous-chaîne au lieu d'un champ déclaré — c'est l'objet du premier constat de l'étude, et la raison pour laquelle le premier palier est un champ de catalogue.
- **Les deux hypothèses instruites, et l'arbitrage rendu partiel plutôt que tranché.**
  - preuve : relevé de `todo/RECIDIVES.md` au 2026-09-13T15:46:00Z — `oracle-remplace-par-controle-maison` 14 items / 12 récidives / 86 %, `page-html-filtres-tableau` 7 / 7 / 100 %, `page-html-sticky-superposes` 5 / 5 / 100 %, `page-html-dictionnaire-colonnes` 4 / 3 / 75 %, `page-html-largeur-lecture-donnees` 4 / 3 / 75 %, contre `gabarit-famille-manquante` 13 / 13 / 100 % ; soit 34 items « l'outil était là » contre 13 « il manquait un gabarit ».
- **État de l'art instruit et daté**, cinq sources de moins de 24 mois, une à l'année seule et deux sans date, chacune signalée.
  - preuve : section 3 de l'étude — TianPan.co du 2026-07-02 (« composition rules […] live in prose »), arXiv 2511.13972 de 2025-11 (la combinaison directive **plus** exemplaire l'emporte, l'exemplaire seul est la condition la plus faible), arXiv 2412.02906 de 2024-12, ASOasis du 2026-04-03, arXiv 2511.04849 de 2025-11.
- **Contrat de sortie du prompt réécrit vérifié poste par poste.**
  - preuve : 13 lignes au tableau de non-recouvrement, toutes citées ; jeu fermé des cinq options O0 (ne rien faire) à O4, avec le statu quo réfuté et non passé sous silence ; un seul « Option retenue » ; plan de revue daté au 2026-10-15 ; aucune ligne de coût en jours ; aucun terme non mesurable hors citation — les deux occurrences restantes sont dans votre phrase citée.
- **Travail enregistré et publié**, sans écriture hors du dossier de sortie.
  - preuve : enregistrement `47d2bea`, poussé sur `claude/html-quality-new-formats-qhfgvj` ; `git status --porcelain` rendait pour seules modifications l'étude elle-même et les deux fichiers régénérés par les hooks.

## 5. Non traité — avec son motif

- **Les quatre constats ne sont pas au registre des améliorations** — motif : hors mandat, l'ouverture de candidats relève d'un mandat de registre ; c'est l'objet de la décision D-4.
- **Le premier palier n'est pas lancé** — motif : dépendance à une décision humaine, il engage un champ de catalogue et un contrôle de recette permanents ; c'est l'objet de la décision D-5.
- **La contre-vérification dépôt par dépôt des onze familles restantes** — motif : hors mandat et sans valeur durable, un champ déclaré au catalogue remplace définitivement ce balayage ; trois familles sur quatorze ont été contrôlées, les onze autres sont déclarées non contre-vérifiées dans l'étude.
- **La mesure qui trancherait l'hypothèse du manque** — retours humains par famille démunie contre famille outillée — motif : impossible à prouver ici, aucun contrôle ne regarde les familles démunies, donc elles ne produisent aucun constat ; la mesure est portée au plan de revue du 2026-10-15.
- **La demande de fusion reste en brouillon** — motif : dépendance à une décision humaine, la sortie du brouillon et la fusion vous appartiennent.

## 6. Écarts à la lettre

*Comment lire ce tableau* : votre texte à gauche, ce que j'ai fait au milieu, le motif à droite. Un « non » sur une ligne annule cette ligne seule.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « D3 a & b » — deux options que j'avais présentées comme concurrentes | Couverture des quatorze familles **et** ordre par usage réel, fondus en une seule séquence | Les deux se composent sans se contredire : (a) donne le périmètre, (b) donne l'ordre. **J'ai lu votre « & » comme une composition** et non comme une hésitation ; si vous vouliez seulement l'une des deux, le rang 1 à 14 de la section 0 bis se tronque sans rien réécrire |
| « D2 a » — enchaîner l'étude complète | L'étude est rendue, **les squelettes ne sont pas écrits** | Écrire les points de départ est le troisième palier de la séquence, pas l'étude. **Restriction assumée** : vous avez commandé l'étude, elle recommande de ne pas commencer par là |
| (non dit) | J'ai **borné** le troisième palier aux trois premiers rangs tant que la mesure du 15 octobre n'existe pas | Le bénéfice des onze autres repose sur une hypothèse non démontrée. **Contrainte ajoutée** : elle réduit le périmètre que votre « a » accordait, et son critère de réouverture est écrit dans l'étude |
| (non dit, et c'est une erreur de ma part) | Mon premier comptage annonçait **17** familles démunies ; le chiffre juste est **14** | Le balayage ne cherchait qu'une seule forme de point de départ. **Corrigé avant publication**, consigné dans l'étude comme son premier constat plutôt que silencieusement rectifié |

## 7. Risques

- **Le premier palier se fait et rien ne suit.**
  - signal : au 15 octobre, le champ est déclaré pour les vingt familles et aucune règle de composition n'est écrite.
  - parade : le plan de revue est daté et porte trois questions nommées, dont celle du nombre de constats produits par les règles du deuxième palier ; une revue sans réponse à cette question est elle-même un constat.
- **Les règles de composition font rougir les dépôts qui consomment le socle.**
  - signal : une suite de vérification qui passait chez un produit ne passe plus après propagation, et l'équipe croit l'échec préexistant.
  - parade : l'étude impose à chaque règle du deuxième palier son plan de mesure de bruit sur les dépôts consommateurs et une entrée en avertissante ; c'est la classe de défaut créée le 08/09 qui l'exige.
- **L'arbitrage des deux hypothèses est repris comme un verdict tranché alors qu'il est partiel.**
  - signal : quelqu'un cite « le manque de gabarit ne coûte rien » en s'appuyant sur cette étude.
  - parade : le biais de sélection est écrit deux fois dans l'étude, en section 0 bis et en section 1, et le troisième palier est borné pour cette raison exacte.
- **L'exemplaire de référence, au troisième palier, fige la direction visuelle autant que la structure.**
  - signal : deux livrables de familles différentes deviennent indiscernables, et un client le remarque avant nous.
  - parade : la tension avec la loi du noyau qui refuse le rendu générique est nommée dans l'analyse du matin ; la ligne de partage entre structure et expression reste une hypothèse à instruire, non un acquis.

## 8. Prochaines actions

*Comment lire ce tableau* : une ligne par action, l'acteur en colonne, les actions exécutables par l'IA en tête par le tri ; la dernière colonne dit ce qu'il en coûte de ne pas la faire. L'ordre est dérivé : d'abord ce qui débloque une décision, ensuite ce qui en dépend. Les sélecteurs `A-N` désignent des actions et ne partagent aucune numérotation avec les décisions `D-N` du bloc 3 ; la numérotation continue celle de la restitution précédente de ce jour.

| # | Action | Acteur | État / motif | Si elle n'est pas faite |
|---|---|---|---|---|
| **A-7** | Lire l'étude et répondre `D-4` et `D-5` par leur lettre — par exemple « D-4 a, D-5 a » | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, l'ouverture de candidats et l'engagement d'un champ permanent au catalogue vous appartiennent. Fichier : `output/03-etudes/20260914-etude-opportunite-premiers-html-nouveaux-formats.md` | les options par défaut (b) et (b) s'appliquent : l'étude reste acquise, rien n'entre au compteur et le rendez-vous du 15 octobre se tient sans matière neuve |
| **A-8** | Sortir la demande de fusion du brouillon et fusionner, ou demander le retrait de la branche | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, la fusion engage la branche principale. Écran : `https://github.com/iguane39/digit-ai-factory/pull/1`, bouton « Ready for review » | l'analyse et l'étude restent sur une branche latérale, hors de l'historique principal |
| **A-9** | Ouvrir les quatre constats en candidats au registre des améliorations | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend la décision D-4 (option (a) ou (c)) | les quatre constats ne vivent que dans un document : ni comptés, ni suivis, ni comparables aux autres candidats |
| **A-10** | Exécuter le premier palier : champ de type et de localisation du point de départ pour les 20 familles, plus le contrôle d'existence à la recette | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend la décision D-5 (option (a)) | la question « cette famille a-t-elle un point de départ » reste indécidable à la machine, et l'erreur de comptage que j'ai commise ce matin reste reproductible par quiconque |
| **A-11** | Tenir la revue datée : confronter le verdict aux faits, dont la mesure des retours par famille outillée contre famille démunie | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_externe`, la date du 2026-10-15 n'est pas atteinte | le verdict n'est jamais confronté aux faits, et l'hypothèse du manque reste indéfiniment non démontrée |

Chaque action se déclare `neuve` : aucune ne porte d'identifiant du registre, puisque aucun candidat n'est ouvert — voir A-9 et le bloc 5.

## 9. Traces

- `output/03-etudes/20260914-etude-opportunite-premiers-html-nouveaux-formats.md` — l'étude, jugée `PASS` 10/10 par `oracle-etude-opportunite.mjs` et `PASS` par `check_markdown.py` sur ses quatre règles de lisibilité, le 14/09/2026.
- `output/03-etudes/20260914-L99-qualite-premiers-html-nouveaux-formats.md` — l'analyse du matin, dont l'étude exécute le prompt réécrit.
- `output/04-plans/Digit-AI - Synthese Mandat - Etude opportunite premiers HTML nouveaux formats - 20260914b.md` — la présente restitution.
- Enregistrement `47d2bea` sur `claude/html-quality-new-formats-qhfgvj`, poussé ; `https://github.com/iguane39/digit-ai-factory/pull/1` en brouillon, surveillée.
- Sources lues sans écriture : `gabarits/documents/catalogue.jsonl`, `gabarits/ETUDE-OPPORTUNITE.md`, `todo/RECIDIVES.md`, `todo/CLASSES.json`, `todo/TODO.jsonl`, `~/.claude/skills/digit-ai-page-html/`, `~/.claude/skills/digit-ai-schemas/assets/`, `/home/user/digit-ai-forge-audit/deliverables/templates/`, `/home/user/digit-ai-forge-tests/`, `/home/user/digit-ai-forge-data/`.
- **Aucun livrable HTML n'est cité comme livré dans ce tour** : la critique d'implémentation de forge-design est sans objet ici, et c'est dit plutôt que tu.
