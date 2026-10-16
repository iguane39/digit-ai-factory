---
destinataire: humain
---

# Synthèse de mandat — deuxième chantier pilot clos : la rectification d'une collision de seq est consommée (05/09/2026)

Le deuxième chantier de votre tri est clos et publié. Le contrôle d'intégrité du journal de run prescrivait un remède qu'il ne lisait pas : un produit avait ajouté l'entrée demandée et restait en échec. Désormais une collision de numéros d'ordre déclarée par ajout est consommée, le message d'échec écrit la forme exacte à ajouter, et le contrat dit que deux sessions le même jour sont le cas normal d'un produit actif. Ce qui change pour vous : un produit actif ne reste plus en échec définitif sur un défaut qu'il a déjà déclaré. Ce qui est attendu de vous : rien ce tour, le chantier suivant s'ouvre dans la foulée comme vous l'avez décidé.

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-6 (a), chantier 2 sur 5 : instruction et clôture de TF-0794 (le remède prescrit par R-42 qui ne soldait pas le défaut, et l'écriture concurrente du ledger).
- **sur quoi** — le pilot `digit-ai-factory` (oracle de conformité, recette, contrat d'interface, registre) ; le journal du produit 02 lu et copié à part pour mesurer, jamais modifié.
- **quand** — fin le **05/09/2026 à 09:41 (UTC+02:00)**, durée depuis votre réponse ≈ 30 minutes de traitement (la réponse date de l'avant-veille au soir).
- **qui** — Claude Fable 5.1 (extension VS Code), pilot en version `b6b08f7` après publication, base `16e425b` avant.

## 2. Verdict en une ligne

TF-0794 **corrigé** : R-42 consomme une rectification de seq (recette 46 → 49, 0 FAIL), le journal réel du produit 02 passe FAIL → PASS sur copie avec l'entrée en forme lisible, contrat §3 amendé, banc 92/93 (défaut préexistant), porte de publication PASS, commit `b6b08f7` poussé.

## 3. Décisions attendues

Rien n'attend de décision ce tour : votre décision 6a couvre l'enchaînement, et ce chantier n'a ouvert aucun arbitrage nouveau.

## 4. Traité — avec sa preuve

- **Le défaut mesuré sur pièce avant d'y toucher** : deux sessions du produit 02 ont calculé leur numéro d'ordre depuis la même queue (deux seq 76, deux seq 77, horodatages exacts) ; le produit a ajouté l'entrée de rectification que le message prescrivait, en prose ; le contrôle rendait toujours le même échec.
  - preuve : lecture du journal du produit (seq 74 à 81 et l'entrée 78 « collision de seq par sessions concurrentes », sans champ `entrees`) ; `oracle-conformite-projet` sur le produit : R-42 FAIL « seq 76 là où 78 était attendu ».
- **Deux causes nommées** : la rectification n'était consommée que pour les horodatages décroissants, jamais pour un seq en double ; et le message ne disait pas le champ à écrire, si bien que le produit a nommé les seq en prose, que rien ne lit.
  - preuve : lecture du code de R-42 (la branche seq poussait toujours un écart ; le message disait « nommant les seq, le ts et la cause » sans nommer `entrees[]`).
- **R-42 consomme la rectification de seq** — classe : un remède prescrit par un contrôle et non consommé par lui ; contrôle rouge → vert : recette 46 → 49 cas. Un seq en double ou en recul nommé dans `entrees[]` d'une rectification ultérieure devient « [RECTIFIÉ] », la suite attendue reprend au plus haut seq vu, l'écart reste imprimé ; un saut en avant reste un écart ; le message d'échec écrit la forme exacte et dit qu'un seq en prose n'est pas lu.
  - preuve : `oracles\self-test.mjs` 49 PASS, 0 FAIL — collision nommée → PASS avec deux « [RECTIFIÉ] » et sans fausse note ; rectification en prose seule → FAIL et le message nomme `entrees[]` ; sans rectification → les deux seq dénoncés.
- **Une fausse note attrapée par la recette** : le compteur « rectification sans écart correspondant » ne reconnaissait pas la nouvelle forme de note et accusait une rectification pourtant consommée.
  - preuve : première mesure sur copie du journal réel : PASS mais « rectification(s) sans écart correspondant : seq 76, 77 » ; après correction (garde de chiffre), PASS sans la note ; assertion ajoutée à la recette.
- **Le gain constaté sur le journal réel, sur copie** : le journal du produit 02 (119 entrées) copié à part, une entrée en forme `entrees[]` ajoutée nommant 76 et 77 → intégrité tenue sur 120 entrées, deux seq « [RECTIFIÉ] ».
  - preuve : `oracle-conformite-projet` sur la copie : R-42 PASS ; sur le produit lui-même : R-42 FAIL toujours, avec le message qui dit désormais exactement quoi écrire (le pilot n'écrit pas chez lui).
- **Le contrat d'interface amendé (§3)** : deux sessions le même jour sont le cas normal ; le `ts` est la clé d'ordre ; le seq se relit dans la queue immédiatement avant un append en un seul appel ; une collision se rectifie par ajout et R-42 la consomme ; l'attribution sous verrou reste au backlog de la forge des outils.
  - preuve : `CONTRAT-INTERFACE.md` § 3, clause datée TF-0794 ; sidecars de verdict régénérés.
- **TF-0794 clos avec sa descente** — classe : un remède prescrit par un contrôle et non consommé par lui ; contrôle rouge → vert : R-42 FAIL → PASS sur la copie du journal réel, recette 46 → 49 cas. L'événement de clôture porte corrections, gains, version corrigée, produits bénéficiaires et la règle retenue.
  - preuve : événement `corrige` journalisé (verdict PASS) ; vues régénérées (16 ouverts, 5 fermés).
- **Publication** en avance rapide, porte de publication verte.
  - preuve : `oracle-nom-client-publie` PASS sur un clone à branche unique ; `git push` → `16e425b..b6b08f7 main -> main` ; banc `oracles\self-tests.mjs` 92/93, cliquet 46 → 49 consigné.

## 5. Non traité — avec son motif

- **L'entrée de rectification en forme lisible chez le produit 02** : *chez le produit* — une ligne à ajouter à son journal, jamais réécrite ; le pilot n'écrit pas chez un produit (mandat du 23/08) ; l'action est au bloc 8.
- **L'attribution du seq sous verrou dans l'écrivain de journal** (`ledger.mjs` de la forge des outils) : *hors mandat* — dépôt frère, mandat propre ; le contrat le nomme au backlog.
- **Les trois chantiers pilot suivants** (contrôle des codes de sortie, clé de versions malformée, standard 404) : *en cours* — ils s'ouvrent dans la foulée, chacun avec sa synthèse.
- **Le remède de l'oracle des skills** (règle K2 (les empreintes des skills installés sur le poste sont relevées à l'ouverture)) : *hors mandat* — non sélectionné ; seul défaut du banc, préexistant.

## 6. Écarts à la lettre

- Le lot demandait « que l'oracle consomme les rectifications » → il consomme celles qui portent le champ `entrees[]`, pas la prose → parce que lire la prose reviendrait à deviner ; le message dit désormais la forme, et le produit n'a qu'une ligne à ajouter.
- Le lot demandait « que le gabarit ledger prévoie l'écriture concurrente » → la doctrine du contrat le prévoit (relecture de la queue avant append, ts clé d'ordre, rectification par ajout) ; l'écrivain lui-même n'a pas été touché → parce qu'il vit chez la forge des outils, hors de ce mandat.
- Vous avez demandé une synthèse par chantier clos → celle-ci ne porte aucune décision → parce que le chantier n'en a ouvert aucune ; le bloc 3 le dit plutôt que d'en inventer une.

## 7. Risques

- **Une rectification abusive** : nommer un seq dans `entrees[]` suffit à le déclarer, sans que rien ne vérifie la cause.
  - signal : un journal où chaque écart porte sa rectification et où la cause est vide ou générique.
  - parade : la cause reste imprimée dans le verdict à chaque exécution, donc lisible par le prochain lecteur ; une cause de moins de vingt caractères pourrait être refusée si l'abus se mesure.
- **Deux sessions qui écrivent dans la même seconde** malgré la relecture de la queue.
  - signal : deux seq identiques avec des `ts` identiques.
  - parade : la rectification par ajout reste la voie ; le verrou dans l'écrivain est au backlog de la forge des outils.
- **Un produit qui n'ajoute jamais l'entrée** : son R-42 reste rouge et finit ignoré.
  - signal : le même FAIL R-42 sur plusieurs lots successifs du même produit.
  - parade : l'action est au bloc 8, une ligne ; le contrôle de récidive du pilot la verra revenir.

## 8. Prochaines actions

Ordre de traitement : d'abord les chantiers restants de votre tri, parce que la décision 6a les couvre et que le contexte est chargé ; puis le geste produit, parce qu'il ferme un échec répété ; les gestes humains inchangés ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-12 | TF-0795, TF-0801, TF-0802 | Instruire les trois chantiers pilot suivants dans l'ordre : contrôle CI3 (chaque contrôle déclare ses codes de sortie) qui rend vert sans chemin d'échec, clé de versions malformée sans rectification, page 404 en standard d'office — une synthèse par chantier clos. | `auto_ia` | `borne_atteinte` — une synthèse par chantier clos (D-6 a) : ce chantier s'arrête à sa restitution, les suivants s'ouvrent dans la foulée avec la leur. | Trois défauts mesurés restent ouverts chez les produits qui les ont payés. |
| A-14 | TF-0794 | Depuis le produit 02, ajouter à `forge\ledger.jsonl` une entrée `type: rectification_horodatage` avec `entrees: [{seq: 76, cause: …}, {seq: 77, cause: …}]` (une ligne, aucune réécriture), puis rejouer `node <PILOT_ROOT>\oracles\oracle-conformite-projet.mjs .` jusqu'à R-42 PASS. | `manuelle_utilisateur` | `decision` — le pilot n'écrit pas chez un produit (mandat du 23/08) ; trace mesurée : la même entrée jouée sur copie rend PASS « intégrité tenue sur 120 entrées ». | Le produit 02 garde un R-42 rouge à chaque conformité, avec un message qui lui dit pourtant quoi écrire. |
| A-15 | `neuve` | Verser chez forge-agents la candidature : `ledger.mjs` attribue le seq sous verrou (relecture de la queue et append en un seul appel), et `verify` consomme les rectifications comme R-42. | `auto_ia` | `hors_mandat` — dépôt frère, mandat propre à forge-agents. | Le contrat dit « cas normal » et l'écrivain de référence continue de produire des collisions. |
| A-1 | `neuve` | Rejouer le remède de l'oracle des skills : `node oracles\oracle-skills.mjs --racine "C:\dev"` puis relire son verdict (règle K2). | `auto_ia` | `hors_mandat` — préparation du poste, non sélectionné. | La garde d'ouverture annonce « poste non prêt » ; banc à 92/93. |
| A-6 | `neuve` (reprise de la synthèse 20260903d) | Sur l'autre poste, avant tout travail : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot, puis vérifier que la garde d'ouverture rend « à jour (b6b08f7) ». | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | La prochaine publication depuis l'autre poste est refusée, ou forcée par-dessus les enregistrements récents. |
| A-7 | `neuve` (reprise de la synthèse 20260903d) | Décider du sort des trois restes de la racine du parc : la seconde copie du pilot, le fichier « null » (à lire avant suppression), le lien brisé. | `manuelle_utilisateur` | `irreversible` — trois suppressions, R-29 ; la garde les déclare et ne les efface pas. | La garde d'ouverture répète les trois avertissements à chaque session. |

## 9. Traces

- Publication : commit `b6b08f7` sur `main`, poussé (`16e425b..b6b08f7`), 7 fichiers ; la clôture de TF-0794 et cette synthèse partent dans le commit suivant.
- Code et doctrine : `oracles\oracle-conformite-projet.mjs` (R-42, consommation des seq rectifiés, message avec la forme) · `oracles\self-test.mjs` (3 cas TF-0794) · `CONTRAT-INTERFACE.md` § 3 (clause TF-0794) · `oracles\baseline-recettes.json` (cliquet 46 → 49).
- Registre : `todo\TODO.jsonl` — événement « corrigé » TF-0794 (corrections, gains sur copie, descente) ; vues `todo\TODO.md`, `todo\AVANCEMENT.md` (16 ouverts, 5 fermés, sceau `9d4679498ed8`).
- Mesures : `oracles\oracle-conformite-projet.mjs` sur le produit 02 (R-42 FAIL, message avec la forme) et sur la copie de son journal avec l'entrée ajoutée (R-42 PASS, deux « [RECTIFIÉ] »).
- Oracles rejoués : `oracle-nom-client-publie` (PASS) · `oracles\self-test.mjs` (49/49) · `oracles\self-tests.mjs` (92/93) · `todo\oracle-todo.mjs` (PASS).
