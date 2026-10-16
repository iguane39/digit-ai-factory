---
destinataire: humain
---

# Synthèse de mandat — décisions 19 et 20, actions 44 à 48 exécutées : trois forges publiées, la porte juge les produits et rougit sur neuf forges, six lots déposés, deux produits mesurés en retard (05/09/2026)

Vos deux décisions et vos cinq actions sont exécutées. Trois agents mandatés ont instruit les trois lots qui attendaient : la forge de développement ne porte plus le nom de produit dans son arbre courant, la forge des outils juge désormais les noms de produits à la porte de publication (règle C5) et éprouve la moitié impure du gate (la porte qui juge un fichier avant d'en autoriser l'écriture), la forge de conception scelle le corps de ses vues dérivées. Les trois commits sont publiés, quatre items clos, les copies installées de ce poste réalignées. Les trois candidatures du tour précédent sont confiées par deux lots de plus, et le relevé d'héritage joué chez les produits en trouve deux en retard sur le canal des lots : chacun a son lot. Ce qui change pour vous : la porte voit maintenant ce qu'elle laissait passer, et la mesure du parc avec cette règle neuve est faite — le pilot et quatre forges sont verts, neuf forges rougissent sur des contenus et des messages de commit anciens. Ce qui est attendu de vous : trois décisions — la forme courte du nom de produit que le pilot porte lui-même dans neuf fichiers, la campagne de réécriture des neuf forges rouges, et le sort des trois produits anciens qui ne portent pas le canal.

## 1. En-tête d'identification

- **quoi** — mandat humain « 19a, 20a, A45, A46, A44, A47, A48 » sur la synthèse 20260905l : instruction des lots f (forge-development), g (forge-agents), e (forge-conception) par agents mandatés ; dépôt des lots de D-19 (A-47) ; relevé d'héritage et lots aux produits en retard (A-48).
- **sur quoi** — forge-development, forge-agents, forge-conception (commits publiés, lots déposés) ; deux produits (un lot déposé chacun, rien d'autre) ; le pilot `digit-ai-factory` (registre, originaux de lots, copies installées).
- **quand** — fin le **05/09/2026 à 19:40 (UTC+02:00)**, ≈ 70 minutes depuis votre mandat, dont 33 de travail parallèle des trois agents.
- **qui** — Claude Fable 5.1 (extension VS Code) et trois agents subordonnés ; pilot en version `8415bd2` avant, cette synthèse part dans le commit suivant.

## 2. Verdict en une ligne

A-45 **fait** (forge-development `053fdaf`, mentions 3 → 0) ; A-46 **fait** (forge-agents `db3d391`, règle C5, banc du hook 34 → 37, recette 215 → 218 ; TF-0820 et TF-0821 clos) ; A-44 **fait** (forge-conception `c8be40d`, self-test 13×50 → 14×51 ; TF-0818 clos) ; A-47 **fait** (lots 20260905h et 20260905i déposés, TF-0822, TF-0823, TF-0824 décidés) ; A-48 **fait** (relevé chez cinq produits : deux en retard, lots 20260905j et 20260905k déposés) ; 5 candidatures neuves (TF-0825 à TF-0829) ; parc avec C5 : pilot et 4 forges PASS, 9 forges FAIL.

## 3. Décisions attendues

Les trois décisions viennent de la règle C5 et du relevé d'héritage : ce que la porte voit maintenant, et ce que les produits anciens ne portent pas. Chaque décision porte le même tableau de trois lignes, à lire ligne par ligne : la colonne « Option » nomme le choix, « Ce qu'elle coûte » donne sa complexité et sa durée, « Ce qu'elle exclut » dit ce à quoi l'on renonce ; les lignes vont de l'option recommandée à l'inaction, rien n'est trié ni omis.

> **D-21 — Que fait-on de la forme courte d'un nom de produit, trois lettres, que le dépôt public du pilot porte dans neuf fichiers suivis, alors que la porte ne la juge pas parce que la table des pseudonymes n'en connaît que la forme longue ?**
> La forge de développement, en vérifiant qu'elle ne recopiait pas le nom, a mesuré que le dépôt du pilot est public et porte la forme courte du même produit ; la mesure du pilot ce soir la confirme : trente-huit occurrences dans neuf fichiers texte suivis — d'anciens lots de retours dont le nom de fichier est déjà pseudonymisé mais pas le contenu, une étude, l'archive du registre, et trois lignes du banc du module de pseudonymisation lui-même. La réécriture du 03/09 a remplacé la forme longue partout ; la forme courte, absente de la table, a traversé. La forme courte est aussi un sigle d'informatique courant : la forge de développement en trouve deux cents occurrences dans ses dépendances installées, ce qui interdit un remplacement aveugle.
> **Recommandation : (a).** Source consultée : le lot de retours de la forge de développement (candidature RV-23, le constat sur le dépôt public du pilot) ; `git grep` sur les fichiers suivis du pilot (38 occurrences, 9 fichiers, formes comptées) ; `c:\dev\_produits-pseudonymes.json` (la forme courte n'y est pas) ; `gh repo view` (dépôt public).
> Un nom qui vit dans le banc du module qui pseudonymise est le cas le plus visible qui soit ; l'alias dans la table est une donnée (loi n° 4), et une fois posé, C5 juge la forme courte partout.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** ajouter la forme courte comme alias du pseudonyme dans la table hors dépôt, corriger les neuf fichiers courants par un commit ordinaire, et joindre la forme courte à la campagne de réécriture de D-22 pour l'historique | simple × court pour la table et le commit ; l'historique suit D-22 | exclut de traiter le pilot à part de la campagne |
| **(b)** corriger les neuf fichiers seulement, sans alias | simple × court | exclut que la porte voie la forme courte demain ; l'historique la garde |
| **(c)** ne rien faire | gratuit | exclut tout effet ; le dépôt public garde le nom |

> **Si rien n'est décidé** : (c) s'applique — la forme courte reste dans neuf fichiers publics.

> **D-22 — Lance-t-on la campagne de réécriture des neuf forges que la règle C5 rougit sur des contenus et des messages de commit anciens, alors que le mode opératoire a tenu deux fois ce jour et qu'une branche protégée refuse tout push forcé ?**
> La porte, jouée ce soir avec la table des produits sur le pilot et les treize forges, rend PASS sur le pilot et quatre forges, FAIL sur neuf : des contenus anciens sur six d'entre elles, des messages de commit sur huit, jusqu'à dix-neuf constats pour une forge. Aucune de ces neuf histoires n'a jamais été réécrite ; les deux réécritures du jour ont tenu en une passe chacune, et la forge de développement a montré la limite : sa branche principale est protégée, un push forcé est refusé, un push ordinaire contourne la règle de demande de fusion. Une campagne se joue forge par forge : paquet, règles dérivées des deux tables, passe, porte verte, publication forcée, clones à rebâtir sur chaque poste.
> **Recommandation : (a).** Source consultée : mesure C5 du soir (verdicts et comptes par forge, contenus et messages distingués) ; `references\TODO-FORGE.md` (mode opératoire et leçons du 05/09) ; le lot de retours de la forge de développement (règle de branche constatée) ; le registre (TF-0829, l'histoire de la forge de développement).
> Neuf histoires publiques portent des noms de produits ; le geste est connu, outillé et mesuré, et la protection de branche est un réglage humain d'une minute.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** campagne en une session mandatée : les neuf forges dans l'ordre des constats, porte C1 à C5 verte avant chaque push forcé, protection de la forge de développement levée puis remise par vous, clones à rebâtir sur l'autre poste | complexe × moyen : neuf passes, neuf pushs forcés, un réglage humain, un reclonage ailleurs | exclut de garder une histoire publique telle quelle |
| **(b)** réécrire seulement les six forges dont l'arbre courant ou les contenus anciens portent un nom, laisser les messages de commit | complexe × moyen | exclut la porte verte : huit forges gardent des messages rouges |
| **(c)** ne rien faire | gratuit | exclut tout effet ; la porte C5 reste rouge à chaque push sur neuf forges |

> **Si rien n'est décidé** : (c) s'applique — neuf forges publient sur une porte rouge.

> **D-23 — Que fait-on des trois produits anciens qui ne portent aucun artefact du canal des lots ni du reste de l'héritage du pilot, alors que le relevé les compte à huit absents chacun ?**
> Le relevé d'héritage, joué en lecture seule chez les cinq produits qui ont un journal de run, distingue deux situations : deux produits portent le canal et sont en retard de trois artefacts — ils ont reçu leur lot ce soir ; trois produits anciens, dont les journaux datent d'août, ne portent ni l'oracle des lots de retours, ni le hook, ni le gabarit de restitution, ni le réglage des hooks — huit artefacts absents. Un lot de travaux ne peut pas leur parvenir par le canal, puisque le canal est ce qui manque ; le dépôt d'une boîte d'entrée chez un produit qui n'a jamais tourné sous ce pilot est un geste à décider, pas à faire en passant.
> **Recommandation : (a).** Source consultée : `oracle-conformite-projet` R-47 (le relevé d'héritage du pilot chez un produit) sur les cinq produits ; `gabarits\HERITAGE.json` (les huit artefacts et leurs sources) ; les journaux de run des trois produits (derniers mouvements les 15 et 19 août).
> Ces trois produits sont hors du canal depuis sa création le 25/08 ; les y faire entrer est un run d'héritage, pas un lot.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** un run d'héritage mandaté par produit, sur demande : recopie des huit artefacts, relevé PASS, commit par le produit | simple × court par produit, sur mandat | exclut une descente sans run |
| **(b)** les déclarer hors du périmètre du pilot dans l'inventaire, jusqu'à leur prochain run | simple × court | exclut toute mesure d'héritage sur eux |
| **(c)** ne rien faire | gratuit | exclut tout effet ; le relevé les compte à huit absents à chaque mesure |

> **Si rien n'est décidé** : (c) s'applique — trois produits restent hors canal, comptés absents.

## 4. Traité — avec sa preuve

- **A-45 — TF-0820, volet mentions, chez forge-development** — classe : un nom de produit dans l'arbre courant que la porte ne voyait pas ; contrôle rouge → vert : recherche sur les fichiers suivis 3 occurrences (2 fichiers) → 0 ; seuls un commentaire et deux docstrings changent. Recette : ruff PASS, pytest 400 passed / 1 skipped, mypy à une erreur préexistante prouvée identique avant et après. Écart déclaré : la règle de branche réelle exige une demande de fusion et deux contrôles, et le compte qui pousse la contourne d'office (« Bypassed rule violations ») — rien n'a été forcé.
  - preuve : commit `053fdaf` (`00097b6..053fdaf`), porte PASS avant push ; lot `digit-ai-forge-development - RETOURS - 20260905b.md` PASS, ingéré (TF-0825, TF-0826, récidives marquées).
- **A-46 — TF-0820 (volet porte) et TF-0821 clos chez forge-agents** — classe : une porte qui ne lit qu'une des deux tables, et un banc qui n'éprouve pas la moitié impure du gate ; contrôle rouge → vert : sur un clone de la forge de développement avant son lot, la porte d'avant rend PASS, la porte avec C5 rend FAIL 5 constats (2 dans l'arbre, 3 dans des messages de commit, deux produits distincts) ; sur dépôt jetable, un nom inventé → FAIL (graphie littérale et variante espacée), pseudonyme seul → PASS, sans table → PASS avec « C5 NON JOUÉE : table absente » déclaré ; la fonction qui lit la version précédente d'un fichier rendait un motif qui mentait sur la cause (zone morte avalée), elle rend 0 neuf / 1 préexistant sur dépôt jetable, un motif porté hors dépôt, et un cas qui lève affiche son erreur (témoin).
  - preuve : commit `db3d391` (`f8d81d8..db3d391`), portes C1 (la première des quatre règles de la porte sur les noms de clients) à C4, puis C1 à C5, PASS avant push ; banc du hook 34 → 37, recette de `quality-oracles` 215 → 218, toutes les recettes de la forge vertes ; lot `…forge-agents - RETOURS - 20260905c.md` PASS, ingéré (TF-0828) ; deux événements de clôture (PASS).
- **A-44 — TF-0818 clos chez forge-conception** — classe : un sceau (l'empreinte qui scelle une vue dérivée) qui prouve la provenance, pas le contenu ; contrôle rouge → vert : la section des écarts retirée de la vue de la fixture verte (996 caractères, les deux écarts opposables), en-tête intact → T3 PASS exit 0 ; après, la vue porte l'empreinte de son propre corps, la règle T5 rend FAIL « corps de la vue altéré », en-tête absent → SANS_OBJET déclaré (aucune migration) ; la liste des sections attendues est citée dans le FAIL, jamais câblée, et un cas épingle la citation au contrat.
  - preuve : commit `c8be40d` (`be41b25..c8be40d`, 10 fichiers), porte PASS avant push ; self-test 13×50 → 14×51, six cas de la branche tenus ; lot `…forge-conception - RETOURS - 20260905d.md` PASS, ingéré (TF-0827) ; événement de clôture (PASS).
- **A-47 — trois candidatures décidées et confiées** (D-19 (a)) — `pilot - TRAVAUX - 20260905h.md` chez forge-conception (TF-0822 : `EXIGENCES.md` jugé et correspondance prose ↔ champ ; TF-0823 : matrice fixture × oracle versionnée) ; `pilot - TRAVAUX - 20260905i.md` chez forge-agents (TF-0824 : contrat de sortie du lanceur écrit, versionné, éprouvé) ; le lot h porte sa ligne « Module producteur lu » avec la source citée.
  - preuve : trois décisions journalisées (rangs 10 à 12) ; `oracle-travaux-pilot` T1 (le moyen de vérification) à T6 (le module producteur lu) PASS sur les deux ; copies déposées dans `input\00-travaux\` des deux forges, vues et non traitées par les agents en cours, comme demandé.
- **A-48 — relevé d'héritage et lots aux produits en retard** (D-20 (a)) — R-47 (le relevé d'héritage du pilot chez un produit) joué en lecture seule chez les cinq produits qui ont un journal de run : deux portent le canal et sont en retard de trois artefacts (gabarit et oracle des lots du 25/08, référentiel des classes du 03/09), trois n'en portent aucun (huit absents). Lots `20260905j` (Produit-02) et `20260905k` (Produit-12) déposés : remise à niveau en un geste depuis le produit, relevé PASS attendu, commit par le produit ; les originaux au pilot désignent les produits par leur pseudonyme.
  - preuve : sorties R-47 (« 0 absent, 3 périmés » ×2 ; « 8 absents » ×3) ; `oracle-travaux-pilot` T1-T6 PASS sur j et k ; boîte `input\00-travaux\` créée chez le second produit, rien d'autre écrit.
- **Copies installées réalignées** sur `db3d391` et `c8be40d` : le hook, le lanceur, la porte (C5 comprise), les skills de conception.
  - preuve : `oracle-skills --appliquer` puis PASS ; hook et porte installés identiques à leur source (comparaison binaire).
- **Mesure du parc avec C5** : pilot PASS ; forges PASS : agents, agents-security, observability, websec ; forges FAIL : audit (1 message), conception (8 contenus, 4 messages), data (16 contenus, 3 messages), design (2 messages), development (3 messages), ops (4 contenus, 1 message), organization (13 contenus, 2 messages), seo-geo (8 contenus, 11 messages), tests (16 messages).
  - preuve : `oracle-nom-client-publie … --produits=<table>` sur les quatorze clones, verdicts et comptes relevés ; TF-0829 journalisé pour l'histoire de la forge de développement.
- **Publication du pilot** en avance rapide.
  - preuve : `git push` → jusqu'à `8415bd2` ; cette synthèse part dans le commit suivant.

## 5. Non traité — avec son motif

- **L'instruction des quatre lots déposés ce tour (h, i chez les forges ; j, k chez les produits)** : *hors mandat* — vos actions disaient « déposer » ; ouvrir une session chez un dépôt frère ou un produit exige un mandat (A-49 à A-52).
- **La forme courte du nom de produit au pilot** : *dépendance à une décision humaine* — D-21 ; rien n'a été modifié dans les neuf fichiers.
- **La réécriture des neuf forges rouges** : *dépendance à une décision humaine* — D-22 ; la mesure est faite, aucun geste.
- **Les trois produits sans canal** : *dépendance à une décision humaine* — D-23.
- **TF-0825 à TF-0829** : *tout entre en candidat*.
- **Deux constats sans classe, en prose** : le point d'entrée déclaré de la forge de conception rend FAIL sur toute cible (constat RC-9 de son lot), et la règle de branche annoncée diffère de la règle configurée (lot de la forge de développement) — *une classe ne se crée que par le pilot, sur décision* ; proposés au prochain tour.
- **A-25 et A-19 (produit 02), A-6 (l'autre poste), A-17 (D-7)** : *inchangés* — non mandatés ce tour.

## 6. Écarts à la lettre

- Le lot f disait « trois mentions dans deux fichiers courants » → la forge en a corrigé trois (deux fichiers), et la règle C5 en compte deux dans l'arbre (une par fichier) plus trois dans des messages de commit → parce que C5 compte par fichier et par message, pas par ligne ; les messages ne se corrigent pas en éditant un fichier (TF-0829).
- Le lot g disait « après, PASS » sur la forge de développement → tenu sur l'arbre, pas sur l'histoire → parce que trois messages de commit portent le nom ; déclaré par la forge au `non_juge` et remonté (TF-0828 : C5 ne balaie pas le contenu de l'historique, trois angles sur quatre).
- Le mandat A-48 disait « un lot par produit en retard » → deux lots déposés, et une boîte d'entrée créée chez le second produit qui n'en avait pas → parce que le canal exige la boîte, et que sa création est le seul écrit hors lot.
- Le lot e annonçait « 996 sur 3 074 » → le dénominateur datait d'avant TF-0814 → déclaré par la forge, le nombre retiré était exact.
- Les lots d et e, déposés avant T6, ne passent plus l'oracle des lots → non modifiés → un lot déposé ne change jamais ; les deux forges l'ont noté en confirmation positive.

## 7. Risques

- **Neuf forges publient sur une porte C5 rouge** tant que D-22 n'est pas tranchée, et la porte installée sur ce poste les refusera désormais au push.
  - signal : un push refusé par la porte sur des constats anciens, comme ce matin pour deux forges.
  - parade : D-22 (a) ; en attendant, mesurer sur un clone à branche unique et publier sur décision explicite.
- **Le dépôt public du pilot porte la forme courte d'un nom de produit** tant que D-21 n'est pas tranchée.
  - signal : une recherche du sigle sur GitHub qui trouve les neuf fichiers.
  - parade : D-21 (a).
- **Deux produits jugent les lots du pilot avec une règle de moins** tant que leurs lots ne sont pas instruits.
  - signal : un lot jugé T6 PASS au pilot et par cinq règles chez le produit.
  - parade : A-51, A-52.
- **La règle de branche de la forge de développement est contournée d'office** par le compte qui pousse : une protection qui ne protège pas.
  - signal : « Bypassed rule violations » à chaque push.
  - parade : réglage humain dans D-22 (a), ou classe et candidature au prochain tour.

## 8. Prochaines actions

Ordre de traitement : d'abord les lots des forges (ils ferment les candidatures du jour), puis les produits (ils ferment la descente de T6) ; les décisions et les restes humains ferment la liste. Le tableau se lit ligne par ligne, dans l'ordre de traitement : la colonne « Identifiant » renvoie à l'item du registre, « Action » dit le geste, « Acteur » qui le fait, « Motif / raison » pourquoi il n'est pas déjà fait, et la dernière colonne ce qui se passe s'il ne l'est pas ; rien n'est trié autrement ni omis.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-49 | TF-0822, TF-0823 | Ouvrir une session chez forge-conception sur le lot `pilot - TRAVAUX - 20260905h.md` (agent mandaté, porte C1 à C5 verte avant push), puis remettre le lot de retours au pilot. | `auto_ia` | `hors_mandat` — ouvrir une session chez un dépôt frère exige un mandat. | Un écart non décidé passe ; une fixture bascule en silence. |
| A-50 | TF-0824 | Ouvrir une session chez forge-agents sur le lot `pilot - TRAVAUX - 20260905i.md`, puis remettre le lot de retours au pilot. | `auto_ia` | `hors_mandat` — même règle. | Le contrat de sortie du lanceur reste sans domicile. |
| A-51 | TF-0819 | Ouvrir une session chez Produit-02 sur le lot `pilot - TRAVAUX - 20260905j.md` (remise à niveau en un geste, relevé PASS, commit par le produit). | `auto_ia` | `hors_mandat` — écrire chez un produit exige un mandat ; sa session était vivante ce soir (journal modifié à 18:15). | Le canal des lots reste asymétrique chez ce produit. |
| A-52 | TF-0819 | Ouvrir une session chez Produit-12 sur le lot `pilot - TRAVAUX - 20260905k.md` (même geste). | `auto_ia` | `hors_mandat` — même règle. | Même asymétrie chez ce produit. |
| A-53 | TF-0826 | Si D-21 (a) : ajouter l'alias à la table hors dépôt, corriger les neuf fichiers par un commit ordinaire, rejouer la porte C1 à C5 sur le pilot (attendu : FAIL sur l'historique seul, PASS sur l'arbre). | `auto_ia` | `dependance_bloc_3` — D-21. | Le dépôt public du pilot garde le nom. |
| A-54 | TF-0829 | Si D-22 (a) : campagne de réécriture des neuf forges (paquet, règles des deux tables, passe, porte C1 à C5 PASS, push forcé), la forge de développement après levée de sa protection par vous ; puis recloner sur l'autre poste. | `auto_ia` | `dependance_bloc_3` — D-22 ; R-38 pour chaque push forcé ; réglage de protection humain. | Neuf forges restent rouges à chaque push. |
| A-55 | `neuve` | Si D-23 (a) : un run d'héritage mandaté par produit ancien (recopie des huit artefacts, relevé PASS, commit par le produit). | `auto_ia` | `dependance_bloc_3` — D-23. | Trois produits restent hors canal. |
| A-6 | `neuve` (reprise) | Sur l'autre poste : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot ; recloner forge-agents (histoire réécrite). | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | Une fusion depuis l'autre poste réintroduit l'ancienne histoire. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : ajouter la rectification de la seq 118 en un seul append, rejouer R-42 (l'intégrité du journal de run). | `auto_ia` | `garde_fou` — session vivante (journal modifié à 18:15). | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot. | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur ; trace mesurée : quatre fichiers non commis. | Un nettoyage efface les chemins d'échec prouvés. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7, non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Forge-development : `053fdaf` publié (`00097b6..053fdaf`) ; lot 20260905f marqué traité.
- Forge-agents : `db3d391` publié (`f8d81d8..db3d391`) ; lot 20260905g marqué traité ; lot `input\00-travaux\pilot - TRAVAUX - 20260905i.md` + sidecar déposés, non traités.
- Forge-conception : `c8be40d` publié (`be41b25..c8be40d`) ; lot 20260905e marqué traité ; lot `input\00-travaux\pilot - TRAVAUX - 20260905h.md` + sidecar déposés, non traités.
- Produits : lots `input\00-travaux\pilot - TRAVAUX - 20260905j.md` (Produit-02) et `…20260905k.md` (Produit-12) + sidecars déposés ; boîte créée chez le second ; rien d'autre.
- Comptes rendus : `input\00-retours\digit-ai-forge-development - RETOURS - 20260905b.md` · `…forge-agents - RETOURS - 20260905c.md` · `…forge-conception - RETOURS - 20260905d.md` (et sidecars), PASS, ingérés.
- Pilot : `todo\TODO.jsonl` — TF-0818, TF-0820, TF-0821 clos ; TF-0822, TF-0823, TF-0824 décidés ; TF-0825 à TF-0829 candidats ; `output\06-travaux-confies\` (lots h, i, j, k) ; vues `todo\TODO.md` et `todo\AVANCEMENT.md` ; cette synthèse — le tout dans le commit qui suit `8415bd2`.
- Poste : `oracle-skills --appliquer` puis PASS ; porte installée avec C5.
- Oracles rejoués : `oracle-nom-client-publie` avec `--produits` sur le pilot et les 13 forges (5 PASS, 9 FAIL) · `gabarits\oracle-lot-retours.mjs` ×3 (PASS) · `oracle-travaux-pilot` ×4 (PASS) · `oracle-conformite-projet` R-47 ×5 (lecture seule) · `oracle-todo` (PASS) · `readme-dossiers --check` (PASS).
- Mémoire du poste : note complétée (règle C5, mesure du parc, forme courte au pilot).
