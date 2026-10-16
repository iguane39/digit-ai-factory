---
destinataire: humain
---

# Synthèse de mandat — les sept campagnes sont closes et vérifiées une par une, et le défaut de format que vous signalez est corrigé dans la Factory : le verdict affiché doit désormais mesurer ce que le fichier jugé mesure (08/09/2026)

Votre retour portait juste, et il désigne un trou réel du dispositif. Pendant que les campagnes rendaient leurs rapports l'un après l'autre, j'ai réaffiché quatre fois la même restitution en l'enrichissant des chiffres du moment, sans jamais redéposer le fichier correspondant. Les contrôles ne regardaient que deux blocs sur neuf : ils ont laissé passer un écran plus riche que la trace, c'est-à-dire une pièce écrite qui ment sur ce qui a été fait. Le contrôle a été étendu, prouvé dans les deux sens, et la règle de conduite est écrite : un tour qui n'apporte qu'un delta met à jour le document et affiche celui-là, un tour qui n'apporte rien rend deux lignes. Sur le fond, tout le travail attendu est terminé : les sept campagnes ont livré, chaque correction a été rejouée par mes soins avant d'être close, et rien n'est publié. Ce qui est attendu de vous : le feu vert de publication, et les deux gestes sur les histoires git qui attendent depuis ce matin.

## 1. En-tête d'identification

- **quoi** — fin du mandat « fais tous les retours et todos » sous vos réponses 13, 14a et 15a, puis correction du défaut de format que vous signalez, dans le message et dans la Factory.
- **sur quoi** — les sept dépôts des campagnes (exploitation, développement, données, design, tests, socle des pages, pilot) ; le juge de restitution, son gabarit et la ligne des gates du pilot ; le registre et le catalogue.
- **quand** — 2026-09-08 11:05 UTC+02:00 (Europe/Paris), durée ≈ 3 h 30 depuis l'ouverture du mandat, dont 1 h 20 depuis le point d'étape précédent.
- **qui** — pilot digit-ai-factory e10f3a5 (14 commits locaux, non publiés) ; `todo\journaliser.mjs`, `todo\oracle-todo.mjs`, `oracles\self-tests.mjs`, porte `oracle-nom-client-publie` avec les tables du canal ; sept agents de campagne sous `gabarits\AGENT-CAMPAGNE.md`.

## 2. Verdict en une ligne

7 campagnes sur 7 rendues et sondées ; 36 items clos en corrigé et 3 laissés en cours avec leur reste nommé ; registre PASS, 91 items clos contre 57 ce matin ; 12 candidatures nées des rapports et 8 de plus par trois lots arrivés en fin de mandat, ingérés et pseudonymisés avant restitution ; vérifications rejouées par le pilot et non recopiées : forge-ops 100 PASS, forge-data 166 PASS, forge-design 117 règles verrouillées, forge-tests suite complète verte, socle des pages 208 cas, pilot 97 recettes sur 97 ; portes de publication vertes sur les 4 dépôts sondés ; défaut de format corrigé, recette du juge 13 → 16 cas, gabarit et ses trois porteurs montés en 2.18.0, oracle des empreintes remis à PASS ; 0 publication, 30 commits locaux répartis sur 7 dépôts.

## 3. Décisions attendues de l'humain

Quatre décisions, toutes des gestes que la doctrine réserve à l'humain : publier, réécrire une histoire, supprimer une branche, remplacer ce qui s'exécute sur le poste. Les deux premières attendent depuis ce matin, les deux suivantes naissent des campagnes.

> **D-16 — L'histoire publiée de la forge de développement, qui porte dans un message de commit d'août le sigle de trois lettres d'un client, se réécrit-elle une seconde fois ?**
> Hier soir, cette histoire a été réécrite et publiée en force avec les tables de l'époque, protection de branche levée puis remise, et la porte l'a déclarée verte. Ce matin, le canal confidentiel porte un alias de trois lettres pour un produit, et la porte, rejouée avec lui, trouve ce sigle suivi d'un nom de domaine dans le corps d'un message de commit du 20 août, présent sur la branche principale publiée. C'est un nom de domaine de client en clair sur un dépôt public. Le mode opératoire d'hier s'applique tel quel.
> **Recommandation : (a).** Source consultée : porte rejouée sur les quatorze dépôts → « digit-ai-forge-development: FAIL 1 C5 df0223e », commit présent sur la branche publiée ; `references\TODO-FORGE.md` § réécrire l'historique d'un dépôt ; précédent d'hier soir.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Réécrire par le mode opératoire, protection levée puis remise à l'identique, publier en force, rebâtir le clone et rejouer le commit de campagne | Moyen × court : mode opératoire et outil de reconstruction rodés ; une seconde histoire réécrite à répercuter sur l'autre poste | Rien : le paquet d'avant reste ; un domaine client cesse d'être public |
| (b) Ne pas réécrire et retirer le sigle de la table du canal | Aucun coût immédiat | La table du canal comme source unique ; le domaine reste public |
| (c) Rien | Aucun coût | Toute publication de cette forge, sa correction du jour comprise |

> **Si rien n'est décidé** : (c) — la forge de développement ne se publie pas, sa correction reste locale.

> **D-17 — Les trois branches d'ancienne histoire que les forges de conception, d'organisation et de SEO-GEO gardent sur ce poste se suppriment-elles, leurs paquets étant écrits ?**
> La reconstruction de ces trois clones sur l'histoire réécrite par l'autre poste a posé dans chacun une branche locale jamais poussée. La porte compte toute branche : quatorze constats y vivent, tous sur des messages d'août. Les trois clones sont alignés sur leur distant, sans commit local, et j'ai écrit ce matin un paquet de sauvegarde par forge, vérifié. Supprimer une branche est un geste humain.
> **Recommandation : (a).** Source consultée : porte sur les quatorze dépôts (5, 2 et 7 constats) ; `git for-each-ref --contains` → une seule référence porteuse par commit condamné ; `git bundle verify` → exit 0 pour les trois paquets.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Supprimer les trois branches, porte rejouée ensuite | Trois suppressions, simple × court | Rien : les trois paquets conservent l'ancienne histoire |
| (b) Garder les branches et déclarer ces forges non publiables depuis ce poste | Aucun coût | Toute publication future de ces forges depuis ce poste |
| (c) Rien | Aucun coût | Le même effet que (b), sans le dire |

> **Si rien n'est décidé** : (c) — les trois forges restent rouges à la porte sur ce poste ; l'autre poste n'est pas affecté.

> **D-18 — Le lot des sept campagnes se publie-t-il maintenant, dépôt par dépôt, la fusion de l'avance du distant faite au passage ?**
> Trente corrections vivent en commits locaux sur sept dépôts, chacune sondée par mes soins et close au registre. Rien n'est publié, parce que la publication est un geste humain. Deux dépôts ont pris de l'avance côté distant pendant la journée, du fait de l'autre poste : ils se fusionnent, jamais ne se rebasent, parce que les empreintes de commit sont citées telles quelles dans les clôtures du registre.
> **Recommandation : (a).** Source consultée : `bootstrap --pull` → pilot 11 devant 3 derrière, forge des outils 9 devant 1 derrière, cinq autres en avance simple ; portes rejouées vertes sur les dépôts sondés ; règle 38 (publication sur feu vert humain).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Publier les sept dépôts, porte jouée avant chacun, fusion sur les deux qui ont divergé | Moyen × court, et je rends compte dépôt par dépôt | Rien ; la forge de développement attend D-16 |
| (b) Publier seulement les dépôts sans divergence | Simple × court | La forge des outils et le pilot, donc le registre : l'autre poste ne verrait ni les clôtures ni les candidatures |
| (c) Rien publier | Aucun coût | Tout le travail du jour reste sur ce poste, et l'autre poste rejouera ce qui est déjà fait |

> **Si rien n'est décidé** : (c) — les trente corrections restent locales, et le risque de doublon avec l'autre poste grandit à chaque heure.

> **D-19 — La copie installée des skills, qui diverge maintenant de la source versionnée sur vingt-huit fichiers, se remet-elle à niveau ?**
> C'est la copie installée qui s'exécute sur ce poste, pas la source du dépôt. Les campagnes du jour ont modifié le socle des pages et deux skills de design ; tant que la propagation n'est pas appliquée, les correctifs livrés ce matin ne protègent aucun run, et ce qui tourne n'est plus ce qui est versionné. La doctrine réserve ce geste à une décision explicite, jamais silencieuse.
> **Recommandation : (b).** Source consultée : `oracle-skills.mjs` rejoué en fin de campagne → FAIL sur la règle de propagation, socle des pages 24 fichiers (11 de contenu, 13 fixtures absentes), skill de design 3, skill de marque 1.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Propager maintenant | Simple × court | Rien, mais fait tourner sur ce poste du code qui n'est pas encore publié |
| (b) Propager juste après la publication (D-18) | Le même geste, une fois le code publié | Un poste qui exécuterait une version que l'autre poste ne peut pas lire |
| (c) Rien | Aucun coût | Les correctifs du jour, qui resteraient inertes sur ce poste |

> **Si rien n'est décidé** : (c) — le poste continue d'exécuter les skills d'avant la campagne.

## 4. Traité — avec sa preuve

- Défaut de format corrigé dans la Factory. Contrôle rouge → vert : le juge comparait cinq propriétés, toutes dans les blocs 3 et 8 ; un écran enrichi sans redépôt passait → sixième propriété ajoutée, les faits mesurés du bloc 2, identifiants, empreintes, versions et dates retirés → un écran qui avance des chiffres absents de la trace est refusé, l'identité des deux côtés est acceptée, et une reformulation portant identifiants et dates ne déclenche rien ; classe : le gate ne voit pas ce que le lecteur lit, prise par l'autre bout.
  - preuve : `node oracles/hook-restitution.test.mjs` → « hook-restitution : 16/16 » (13 avant) ; `node oracles/self-tests.mjs` → « [CLIQUET] oracles/hook-restitution.test.mjs : 13 → 16 cas », « 97/97 recettes jouées et vertes ».
- Les trois porteurs de la forme montés ensemble en 2.18.0, comme la doctrine l'impose : le gabarit, son juge, et le rappel que l'agent lit au moment où on lui refuse sa réponse, plus la ligne des gates lue à l'ouverture. La règle de conduite y est écrite : un tour qui n'apporte qu'un delta redépose le document et affiche celui-là ; un tour qui n'apporte rien de neuf rend un accusé bref.
  - preuve : `grep -c "2.18.0"` → 1 dans `gabarits\RESTITUTION.md`, 1 dans `oracles\hook-ouverture.mjs`, 1 dans `oracles\hook-restitution.mjs` ; relevé d'ouverture rejoué, ligne des gates portant la v2.18.0 en tête.
- Sept campagnes rendues, chacune sondée par le pilot avant toute clôture : diff lu, vérifications natives rejouées ici, portes de publication jouées, arbre laissé propre. Classe visée : un livrable accepté sur une preuve recopiée plutôt que sur un oracle exécuté.
  - preuve : exploitation « Self-test forge-ops : 100 PASS, 0 FAIL », porte PASS ; développement suite complète verte ; données « 166 PASS, 0 FAIL » et les trois verbes rejoués sur leurs fixtures vertes et rouges ; design « Tout vert — 36 oracles, 117 règles verrouillées », porte PASS ; tests suite complète exit 0 ; socle des pages « 208/208 cas passés » et diff sans aucun fichier hors du skill visé.
- Trente-six items clos en corrigé au registre, chacun avec ses corrections, ses gains chiffrés, la version locale de sa forge et sa descente règle plus oracle ; trois items laissés en cours avec un reste nommé plutôt que clos à tort. Classe tenue à distance : une clôture prononcée sur le rapport de son propre auteur, sans rejeu par le pilot ; `todo\oracle-todo.mjs` → PASS après chaque écriture du registre.
  - preuve : `journaliser.mjs` → « 16 événement(s) journalisé(s) » puis « 20 événement(s) » ; `oracle-todo.mjs` → PASS ; comptes du registre : 90 items clos, 36 candidats, 5 décidés, 4 en cours.
- Douze candidatures nées des rapports, dont la cause première de la suite de tests muette pendant dix-huit jours : l'anonymiseur remplace un nom à l'intérieur d'un identifiant de code, et c'est au pilot que ça se corrige — classe : une pseudonymisation qui écrit à l'intérieur d'un jeton de code au lieu de s'arrêter à sa frontière.
  - preuve : `journaliser.mjs` → « 3 événement(s) » puis « 9 événement(s) » ; `oracle-todo.mjs` → PASS.
- Un lot de retours arrivé pendant la campagne a été ingéré et pseudonymisé avant restitution, l'avance du distant fusionnée en local sans rebase pour ne pas fausser les empreintes citées au registre. Contrôle rouge → vert : l'anonymiseur a de nouveau nommé le lot par l'alias court d'un autre produit → renommé et réécrit au pseudonyme du nom complet, 0 occurrence de l'alias, 0 nom réel sur 65 testés dans le lot, dans l'index et dans le registre ; classe : l'alias le plus court apparié avant le nom complet, journalisée ce matin et reproduite en direct.
  - preuve : `ingerer-lot.mjs` → « [OK] 5 candidature(s) ingérée(s) » puis 2 puis 1, trois lots ; `git merge origin/main` → 8 conflits résolus, registre fusionné sans perte (513 lignes, 56 locales et 3 du distant) ; `oracle-todo.mjs` → PASS après fusion et après ingestion.
- Catalogue de services complété pour la forge des données. Contrôle rouge → vert : le point d'entrée d'un service affichait un mot amputé de sa première lettre dans le fichier de lecture généré, une tabulation ayant été écrite à la place de la séquence d'échappement → compte des tabulations 1 → 0, format de ligne validé ; classe : séquence d'échappement prise pour un antislash.
  - preuve : « {"cat_dat_07_maj":1,"ajoutees":["cat-dat-12","cat-dat-13"],"lignes":92} » ; « jsonl valide » ; `generer-vues.mjs` → deux fichiers régénérés.
- Site de scellement né de la campagne design déclaré au registre des empreintes. Contrôle rouge → vert : l'oracle des empreintes rendait FAIL sur le parc depuis 08:31 → PASS après déclaration ; classe : un mécanisme de scellement naît sans rejoindre la table.
  - preuve : `node oracles/oracle-empreintes.mjs` → « "verdict": "PASS" ».

## 5. Non traité — avec son motif

- Publication des sept dépôts : attend D-18, geste humain (règle 38).
- Réécriture de la forge de développement : attend D-16 ; suppression des trois branches d'ancienne histoire : attend D-17 ; propagation des skills installés : attend D-19.
- Fusion des tables de pseudonymisation : attend votre lecture des six lignes déposées dans le canal privé.
- Les trois items laissés en cours : un diagnostic dont la correction vit chez le socle des pages, et deux paliers de stratégie de tests dont la condition de clôture exige une campagne sur un produit réel, que la recette a refusé de déclarer tenue sur un banc.
- Les six volets d'oracle proposés par les items du pilot et non livrés par sa campagne : journalisés en candidature plutôt que bâclés, parce que cinq vivent dans le même juge et que la doctrine interdit de le faire monter deux fois dans la même session.
- Les huit candidatures des trois lots arrivés en fin de mandat : entrées au registre en candidat, non décidées, parce qu'une candidature ne se décide pas seule.
- Le fichier parasite à la racine du parc et les deux réserves du 01/09 : inchangés. Le lot du 03/09, lui, est entré dans le suivi avec les lots du jour : la porte de publication rejouée sur le dépôt le déclare acceptable (PASS, aucun bloquant), son nom ne figurant dans aucune des deux tables — il reste néanmoins à rattacher à un produit lors de l’arbitrage.

## 6. Écarts à la lettre

- Vous avez demandé de corriger le format « et dans la Factory si besoin » → j'ai corrigé les deux, et j'ai fait monter la version du gabarit → pourquoi : le défaut n'était pas une inattention isolée mais un trou du contrôle, qui laissait passer un écran plus riche que la trace ; le corriger sans le prouver dans les deux sens aurait reproduit la classe que la journée entière combat.
- Le contrôle neuf compare les nombres du bloc 2, pas le texte → pourquoi : le juge pose depuis l'origine qu'on ne compare jamais des textes mot à mot, seulement ce sur quoi le lecteur agit ; les compteurs d'un verdict ne s'abrègent pas, ils se recopient, et une reformulation légitime ne doit rien déclencher.
- Je n'ai pas rebasé le pilot sur l'avance du distant → pourquoi : les empreintes de commit sont citées telles quelles dans les trente-six clôtures du registre ; un rebase les rendrait fausses. La fusion se fera à la publication.
- La campagne des données a livré un niveau de confiance de lignage inférieur à celui que le retour demandait → accepté à la clôture → pourquoi : sur l'échelle de la forge, les niveaux supérieurs supposent un grain colonne, et un lignage au grain table qui s'en réclamerait mentirait ; l'arbitrage est écrit au code et au profil.
- Aucun autre écart.

## 7. Risques

- **Une trace périmée pendant qu'un mandat dure** : signal = un écran qui porte des chiffres que le document ne porte pas ; parade = le contrôle neuf, désormais bloquant, et la règle de conduite écrite dans les trois porteurs.
- **Doublon avec l'autre poste** : signal = un item corrigé des deux côtés, ou un push refusé pour non-avance rapide ; parade = publier tôt (D-18), fusionner sans rebaser, et le registre comme point de coordination.
- **Un correctif inerte** : signal = la copie installée d'un skill diverge de sa source ; parade = D-19, et le contrôle de propagation rejoué après.
- **Une clôture optimiste** : signal = un item clos sur le rapport de son agent sans rejeu ; parade = chaque clôture du jour porte une preuve rejouée ici, et trois items ont été laissés en cours plutôt que clos.
- **Un domaine client public** : signal = la porte rouge sur un commit publié ; parade = D-16, et aucune publication de cette forge d'ici là.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-61 | Publier les sept dépôts, porte jouée avant chacun, fusion sur le pilot et sur la forge des outils, compte rendu dépôt par dépôt | TF-0844, TF-0845, TF-0886, TF-0893, TF-0894, TF-0911, TF-0875, TF-0846, TF-0830, TF-0833, TF-0834, TF-0835, TF-0866, TF-0839, TF-0840, TF-0876, TF-0841, TF-0842, TF-0843, TF-0899, TF-0900, TF-0896, TF-0897, TF-0909, TF-0910, TF-0901, TF-0890, TF-0903, TF-0892, TF-0905, TF-0906, TF-0895, TF-0898, TF-0902, TF-0891, TF-0904, TF-0907, TF-0908, TF-0889, TF-0918 | auto_ia | dependance_bloc_3 (D-18) | porte puis `git push origin main` dans chacun des sept dépôts, `git merge origin/main` d'abord sur les deux qui ont divergé | trente corrections restent sur ce poste |
| A-58 | Réécrire l'histoire de la forge de développement, protection levée puis remise, publier en force, rebâtir le clone et rejouer son commit de campagne | TF-0829, TF-0886 | auto_ia | dependance_bloc_3 (D-16) | `references\TODO-FORGE.md` § réécriture puis `node bootstrap.mjs --rebatir ..\digit-ai-forge-development` | un domaine client reste public |
| A-59 | Supprimer les trois branches d'ancienne histoire et rejouer la porte sur les trois forges | neuve | auto_ia | dependance_bloc_3 (D-17) | `git branch -D sauvegarde/ancienne-histoire-20260907` dans `..\digit-ai-forge-{conception,organization,seo-geo}` puis la porte | trois forges restent rouges à la porte sur ce poste |
| A-62 | Propager la source versionnée des skills vers la copie installée, puis rejouer le contrôle | TF-0920 | auto_ia | dependance_bloc_3 (D-19) | `node oracles/oracle-skills.mjs --appliquer` puis `node oracles/oracle-skills.mjs` | les correctifs du jour restent inertes sur ce poste |
| A-63 | Remettre à niveau la copie embarquée du composant de filtres dans le skill des schémas, puis rejouer la parité | TF-0919 | auto_ia | dependance_bloc_3 (D-18, après publication de la forge des outils) | `node .claude/skills/digit-ai-page-html/scripts/embarquer-composants.mjs --ecrire` dans `..\digit-ai-forge-agents`, puis `--constat` | une copie embarquée diverge de sa source dans un dépôt publié |
| A-48 | Fusionner les tables de pseudonymisation selon vos six réponses, rejouer la porte sur le parc, rectifier les pseudonymes périmés au registre | neuve | auto_ia | dependance_bloc_3 (lecture humaine des six lignes) | `node scripts/fusionner-tables-confidentielles.mjs` après édition du canal | deux tables continuent de vivre |
| A-64 | Décider les douze candidatures nées des rapports et ouvrir la campagne suivante, la cause de la suite muette d'abord | TF-0912, TF-0913, TF-0914, TF-0915, TF-0916, TF-0917, TF-0919, TF-0921, TF-0922, TF-0923, TF-0924, TF-0925, TF-0926, TF-0927 | auto_ia | gate_gouvernance (une candidature ne se décide pas seule) | `node todo/journaliser.mjs --fichier <decisions.json>` après votre mot | douze constats mesurés restent candidats |
| A-57 | Lire les six lignes du fichier d'arbitrage des tables et inscrire par ligne `neuf`, `même` ou `écarter` | neuve | manuelle_utilisateur | decision : chaque ligne se tranche au vu d'un nom réel, qui ne peut être ni affiché ici ni deviné | ouvrir `c:\dev\_confidentiel\arbitrages\20260908-D13-fusion-tables-poste-A.md`, renseigner la colonne Décision, puis me le dire | six pseudonymes restent ambigus entre les deux postes |
| A-52 | Supprimer le fichier `null` à la racine du parc | neuve | manuelle_utilisateur | irreversible : supprimer un fichier est un geste humain (règle 29) ; contenu lu par deux sondes | `Remove-Item c:\dev\null` | un fichier parasite reste à la racine du parc |

Ordre : A-61 d'abord, parce que chaque heure sans publication augmente le risque que l'autre poste refasse ce qui est fait ; A-58 et A-59 dès leur décision, parce que l'une ferme une fuite et l'autre ne coûte rien ; A-62 et A-63 juste après la publication, parce qu'ils portent sur ce qui vient d'être publié ; A-64 et A-48 sur votre mot ; A-57 et A-52 à votre convenance.

## 9. Traces

- pilot e10f3a5, 14 commits locaux — `oracles\hook-restitution.mjs` et sa recette, `gabarits\RESTITUTION.md` 2.18.0, `oracles\hook-ouverture.mjs`, `references\EMPREINTES.md`, `todo\TODO.jsonl` et ses vues, `catalogues\catalogue.jsonl`, `oracles\baseline-recettes.json`.
- `..\digit-ai-forge-ops` 7b86064 · `..\digit-ai-forge-development` 8029348 · `..\digit-ai-forge-data` 28a2b0c · `..\digit-ai-forge-design` 949f08f · `..\digit-ai-forge-tests` c0e4e73 · `..\digit-ai-forge-agents` 0ae67c6 — tous locaux, arbres propres.
- `c:\dev\_confidentiel\arbitrages\20260908-D13-fusion-tables-poste-A.md` — six conflits et dix ajouts à trancher.
- `c:\dev\_sauvegardes\` — huit paquets vérifiés, dont les trois écrits ce matin pour les branches d'ancienne histoire.
- scratchpad `campagne-d14\` — sept dossiers d'items, quatre fichiers de clôtures, les candidatures.
