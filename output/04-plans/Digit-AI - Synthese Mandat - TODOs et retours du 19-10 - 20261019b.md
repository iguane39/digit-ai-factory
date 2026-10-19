---
destinataire: humain
---

# Synthèse Mandat — 7 lots reçus, 24 sujets traités, 20 corrections publiées, 4 décisions exécutées (19/10/2026)

## 0. Synthèse d'ouverture

Les sept lots de retours en attente sont entrés au registre, et les vingt-quatre sujets ouverts sont traités. Vingt corrections qui ne vous revenaient pas sont faites, contrôlées et publiées dans le pilot et 4 forges ; les produits les recevront à leur prochaine ouverture. Vos quatre décisions sont exécutées. Six constats relevés en passant attendent la revue hebdomadaire, et une vérification ne peut se faire que sur votre autre poste.

## 1. En-tête d'identification

Synthèse de clôture de la campagne « traite les retours et todos », sur le pilot digit-ai-factory et les forges forge-agents, forge-design, forge-tests et forge-seo-geo, poste Dell-XPS-16. Période : 19/10/2026, de 10:05 à 12:31, heure de Paris (UTC+02:00). Session de pilotage Claude Opus 5.5 ; 7 agents délégués (6 de campagne, 1 rédacteur, Sonnet 5.5) et 7 relecteurs d'intention ; escalade de modèle : aucune.

Intention de la demande : qu'aucun retour des produits ne reste sans traitement, et que les sujets ouverts du registre avancent jusqu'à leur correction ou jusqu'à votre décision.

Test rétro : le résultat sert cette intention pour les 7 lots et les 24 sujets ; il en reste une vérification sur l'autre poste et 6 constats neufs, entrés au registre.

## 2. Verdict en une ligne

7 lots ingérés (13 candidatures), 24 sujets clos sur 24, 4 décisions exécutées, 5 dépôts publiés ; registre PASS.

## 3. Décisions attendues

Rien n'attend de décision : D-34 à D-37 sont tranchées et exécutées ; aucune décision neuve.

## 4. Traité

Chaque élément, avec ce qui le prouve. Les 20 corrections ne vous revenaient pas (R-58, seules les décisions qui vous reviennent vous sont posées) ; les 4 autres sujets ont suivi vos réponses.

- Vos sélecteurs « A1 & A2 » répondaient au point d'étape de 11:58 de cette session, et non à la synthèse d'une autre session déposée le même jour sous l'indice a :
  - A-1 de ce point d'étape, recevoir le dernier rapport, clore les sujets au registre et publier : exécuté, preuves aux puces « Publication » et « Registre » ci-dessous ;
  - A-2 de ce point d'étape, vérifier le second dossier du jeton sur l'autre poste : non exécutée ; voies essayées : liste des sessions joignables (`ListAgents` : 2 sessions, toutes deux sur ce poste), recherche du fichier sous `C:/dev` (`Get-ChildItem -Recurse -Filter gsc-token.json` : 0 résultat) ; reportée en A-3.
- Boîte d'entrée : 7 lots accueillis et pseudonymisés, 0 refusé, puis ingérés : 13 candidatures, de TF-1879 à TF-1891 ; `node todo/ingerer-lot.mjs` rend [OK] sur les 7 lots, essayés d'abord sur une copie du registre.
- Vos décisions, chacune avec la preuve de son geste :
  - D-34 b, jeton Google : `C:/dev/digit-ai.fr/.gitignore` (ligne 38) ignore `gsc-token.json` à toute profondeur (`git check-ignore -v` sur 3 emplacements) ; aucun fichier de jeton sur ce poste ; TF-1870 clos au registre, `node todo/oracle-todo.mjs` PASS ;
  - D-35 a : `REGLES-PROJET.md` règle R-63 point 2 bis, 3 étapes écrites avec leurs faits ; TF-1879 et TF-1881 clos au registre, `node todo/oracle-todo.mjs` PASS ;
  - D-36 b : l'oracle A4 existe (TF-1882), aucune règle neuve ; TF-1883 clos au registre, `node todo/oracle-todo.mjs` PASS ;
  - D-37 b : la section Microsoft 365 du référentiel des intégrations suffit, aucun skill ; TF-1889 clos au registre, `node todo/oracle-todo.mjs` PASS.
- Pilot, 9 corrections, chacune rouge puis verte :
  - TF-1863, commande d'attribution d'indice exécutable, recette 19 puis 27 cas ;
  - TF-1874, famille d'un livrable vérifiée à l'écriture d'une page, 11 puis 14 cas ;
  - TF-1877, « Rapport visuel des tests » trouve sa famille, 59 puis 63 cas, et l'oracle de la famille entre au registre des oracles, 96 puis 97 domaines ;
  - TF-1878, cause établie (variable `GIT_DIR` héritée), 98 puis 100 cas ; garde d'arbre bornée, 9 puis 12 cas ;
  - TF-1880, garde-fou Dropbox au registre des garde-fous, recette 15/15 ;
  - TF-1885, un prompt collé ne choisit plus le skill, 66 puis 74 cas ;
  - TF-1886, une session ou un agent est un lecteur qui exécute, 28 puis 30 cas ;
  - TF-1887, commandes prescrites en barres obliques, 40 cas verts ;
  - TF-1888, Microsoft 365 au référentiel des intégrations, oracle d'écriture FAIL puis PASS.
- forge-agents, 6 corrections :
  - TF-1882, oracle de format A4 neuf : la fixture fautive sort sur 2 pages dans 3 conditions de marges sur 4, la conforme sur 1 dans les 4 ;
  - TF-1884, langue déclarée admise, 2 faux refus levés, plantage de console supprimé ;
  - TF-1875, 4 défauts des graphiques du socle corrigés, chacun par sa fixture rouge puis verte (9 constats puis 0 à 390 px) et un composant d'entonnoir créé ;
  - TF-1891, chevauchement d'un texte sur une légende relevé : fixture PASS puis FAIL, 0 page accusée de plus sur 174 ;
  - TF-1890, l'exemple de référence du gabarit de schémas passe de 3 jeux d'oracles en échec à 0, recette neuve de 16 contrôles ;
  - TF-1861, suppression vérifiée dans les dépôts jetables ; recette du socle 646 puis 701 cas, agrégateur 529 puis 536 contrôles.
- forge-design, 3 corrections : TF-1862, témoin refondé sur le thème final de la page ; TF-1876, page posée au socle FAIL puis PASS, 13 avertissements à tort ramenés à 0 ; TF-1861, 3 rouges sur 55 puis 0 ; recette 482 puis 492, 0 échec.
- forge-tests : TF-1864, cause établie (chemin accentué hors mode UTF-8), test neuf rouge puis vert, suite 1 517 puis 1 518 tests, 0 échec.
- forge-seo-geo : TF-1869, 65 numéros faux sur 91 et 3 comptes réalignés sur la grille de 89 nœuds, contrôle neuf : 38 écarts sur l'ancienne matrice, 0 sur la nouvelle ; recette 222 puis 243 cas.
- Classe neuve `oracle-faux-negatif-sur-rendu`, fondée par TF-1891 avec son juge ; 3 retours rattachés à des classes existantes ; `node todo/oracle-todo.mjs` PASS.
- Constats en passant : 6 candidats, TF-1894 à TF-1899, dont la recette complète du pilot rouge sur 3 recettes aux comptes identiques sur le commit de départ.
- Publication sous le GO permanent de push des forges et du pilot (décisions humaines D-53 (b) et D-54 (b) du 03/10/2026, `REGLES-PROJET.md` règle R-38 point 6), garde des noms jouée à chaque envoi :
  - forge-seo-geo, forge-design et forge-agents publiés, 0 commit restant chacun (`git rev-list`) ;
  - forge-tests refusé 2 fois par la garde des noms : le test d'un ancien sujet nommait un produit en clair ; nom remplacé par son pseudonyme, commits réordonnés avant envoi, puis publié, 0 restant ;
  - pilot publié, garde des noms jouée pendant 37 minutes, 0 commit restant et 0 de retard (`git rev-list`) ; le commit de cette synthèse part au prochain envoi.
- Copies installées des skills recopiées par `node bootstrap.mjs --pull` : `oracle-skills` PASS, poste prêt ; suite de forge-design rejouée après la propagation, 492 vérifications, 0 échec.
- Poste : défaut d'ouverture levé, 4 arborescences d'agents fusionnées retirées, branches gardées ; compte des produits régénéré, 29 puis 30.
- Relecture d'intention : sert après 1 passe, gravité mineure : la passe initiale avait lu vos sélecteurs « A1 & A2 » dans la synthèse d'une autre session ; la synthèse dit maintenant à quelles actions ils répondaient ; relectures RI-20261019-10 et RI-20261019-11 consignées.

## 5. Non traité

- La vérification du jeton dans son second dossier — motif : hors_mandat, ce dossier n'existe que sur l'autre poste.
- Les 6 constats en passant, TF-1894 à TF-1899 — motif : decision, ils entrent en candidats et passent à la revue hebdomadaire.
- Les 46 sujets déjà en cours avant ce tour — motif : hors_mandat, ils attendent un produit, une échéance ou une décision antérieure ; aucun n'attend la session.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Traiter les todos | J'ai tranché 20 sujets sur 24 et ne vous en ai posé que 4 | R-58 : seules les décisions qui vous reviennent vous sont posées |
| 34b | J'ai vérifié le seul dossier présent sur ce poste | Le second dossier du jeton n'existe que sur l'autre poste |
| A2 (vérifier le second dossier du jeton) | Non exécutée, reportée en A-3 | Aucune session ne tourne sur l'autre poste ; les 2 sessions voisines sont sur ce poste |

## 7. Risques

- Un message d'enregistrement a annoncé plus que ce qu'il portait.
  - Énoncé : le commit 4c4e2429 annonce des sujets clos alors que leur inscription avait été annulée par la garde du registre ; elle est faite au commit 68264517.
  - Signal : un registre qui ne contient pas ce qu'un message annonce.
  - Parade : lire le message de l'outil d'écriture avant tout enregistrement.
- Un agent a annulé un commit d'essai dans le dépôt réel du pilot.
  - Énoncé : la recette d'oracle-skills, sous une variable git héritée, a écrit un commit dans le pilot ; l'agent l'a retiré.
  - Signal : un commit étranger dans l'histoire.
  - Parade : histoire vérifiée, 13 commits de la campagne sur 13 présents ; la cause est corrigée (TF-1878).

## 8. Prochaines actions

Ordre : la vérification sur l'autre poste d'abord, parce qu'elle touche un jeton à droits d'écriture ; les constats ensuite, à la revue hebdomadaire.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-3** | TF-1870 | Vérifier que le second dossier du jeton l'ignore, à la prochaine session sur l'autre poste | auto_ia | dependance_externe : dossier absent de ce poste | `git -C C:/dev/<second-dossier> check-ignore -v sites/gsc-token.json` | Le jeton y reste peut-être publiable |
| **A-4** | TF-1894 | Instruire les 6 constats à la revue hebdomadaire | auto_ia | hors_mandat : constats hors des lots du jour, entrés en candidats | `node todo/revue-hebdo.mjs --depuis D-38 --sortie output/04-plans` | Les défauts restent sans correction |

## 9. Traces

- Lots : `input/00-retours/Produit-12 - RETOURS - 20261018a.md`, `input/00-retours/Produit-84 - RETOURS - 20261016a.md` et les 5 suivants
- Registre : `todo/TODO.jsonl` ; classes : `todo/CLASSES.json` 1.45.0 ; décisions : `decisions/REGISTRE.jsonl` ; flotte : `todo/observabilite/flotte-campagnes.jsonl`
- Règle : `REGLES-PROJET.md` ; référentiels : `references/INTEGRATIONS-FOURNISSEURS.md`, `references/GARDE-FOUS-PLATEFORME.json`
- Commits du pilot : 2c8eca5c, 75481d23, 74c713a5, 184fce8f, cc377eed, a8af3720, 6a253536, 09b3872d, 5e354f9d, 96ba8766, 0494fe7f, 4c4e2429, 68264517, 856280bc, 1d8c928f, 7e5bae35
- Commits des forges : forge-agents 0c60149, 74ff6a2, 40f45c1, d00c2f3, 3a4b04c, 0580f5e, 770afd2 ; forge-design e649d97, 04e9a2f, a3f9b34 ; forge-tests f0a2997, 1a4925f ; forge-seo-geo b186447
