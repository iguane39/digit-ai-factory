---
destinataire: humain
---

# Synthèse de mandat — D-12 (a) exécutée : la règle de publication couvre désormais les candidatures d'office, et le registre en ligne porte la classe neuve, vérifié sur une copie fraîche (11/09/2026)

Votre feu vert est exécuté : la règle de publication porte un cinquième paragraphe qui étend la couverture d'office aux enregistrements de registre ne contenant que des candidatures en attente de votre mot, leur classe et les vues, aux deux mêmes conditions qu'avant — porte de publication passée juste avant, rien d'autre dans l'enregistrement. Décisions, clôtures et règles restent à votre feu vert explicite. Dans la foulée, l'enregistrement de registre de ce matin et l'amendement lui-même sont publiés, et une copie fraîche de ce qui est en ligne confirme que le registre y porte la candidature, la classe et la règle, sans aucun nom interdit. Le va-et-vient qui vous avait fait ouvrir cette session n'a plus de cause structurelle. Aucune décision fermée nouvelle : il reste vos mots sur les cinq candidatures ouvertes, dont celle qui rendra la boucle de ce matin visible à l'oracle.

## 1. En-tête d'identification

- **quoi** — exécution de la décision humaine D-12 (a) du 11/09/2026 : amendement de R-38 (paragraphe 5) et du renvoi au noyau, publication de l'enregistrement de registre (TF-1019, classe neuve, vues) et de l'amendement, mesure sur clone frais après.
- **sur quoi** — la factory `digit-ai-factory` (le pilot), branche `main` : `REGLES-PROJET.md`, `CLAUDE.md`, registre et vues.
- **quand** — 2026-09-11 09:58 UTC+02:00 (Europe/Paris) ; votre message « 12a » est horodaté 09:48, durée ≈ 10 min, relevée à l'horloge et non estimée.
- **qui** — pilot `main` publié en `57e48e4` (`origin/main` = `HEAD`, 0/0) ; oracles joués : `oracle-claude-md` (noyau), `oracle-nom-client-publie` (arbre par le hook `pre-push`, puis clone frais), `oracle-todo` (sur le clone frais), `oracle-synthese`.

## 2. Verdict en une ligne

**D-12 (a) exécutée : R-38 §5 écrit (couverture d'office des enregistrements de registre ne portant que des candidatures en `candidat`, leur classe et les vues ; décisions, clôtures, règles au GO explicite), renvoi du noyau « R-38 §4-5 », `oracle-claude-md` PASS (6 141 octets ≤ 6 144) ; push explicite `5d84e1a..57e48e4` (2 enregistrements : registre TF-1019 et règle), `PUSH_EXIT=0`, 149 s porte du hook comprise, `ls-remote` = `57e48e4`, `fetch` 0/0 ; clone frais à branche unique de l'origine : `57e48e4`, 698 enregistrements, 1 427 fichiers, TF-1019 présent au registre en ligne, `CLASSES.json` 1.9.0 (66 classes, classe neuve présente), R-38 §5 présent, `oracle-todo` PASS, porte PASS 1 constat 0 antériorité 0 bloquant en 95 s ; clone supprimé.**

## 3. Décisions attendues de l'humain

Aucune décision fermée nouvelle n'attend l'humain dans ce tour : les cinq candidatures ouvertes (TF-1014 à TF-1017 hier, TF-1019 ce matin) attendent chacune votre mot « décide TF-#### », au tableau du bloc 8.

## 4. Traité — avec sa preuve

- **R-38 porte un paragraphe 5, daté et sourcé par votre décision, et le noyau renvoie aux deux paragraphes.** L'extension est bornée : candidatures en `candidat`, leur classe, les vues ; les deux conditions du paragraphe 4 sont reprises ; décisions, clôtures, règles et contenu de produit restent au GO explicite.
  - preuve : `REGLES-PROJET.md` « 5. **Extension aux constats en passant (D-12 (a), 11/09/2026).** … » ; `CLAUDE.md` ligne du garde-fou : « push sur GO humain (R-38 §4-5) » ; `oracle-claude-md` **PASS**, N1 « noyau 6141 octets ≤ 6144 », N4 aucun quantificateur perdu ; enregistrement `57e48e4`.
- **L'enregistrement de registre de ce matin et l'amendement sont publiés, sha explicite, porte rejouée par le hook.**
  - preuve : `git log origin/main..HEAD` avant push : 2 enregistrements (`0c464f2` TF-1019, `57e48e4` règle) ; `git push origin 57e48e4…:refs/heads/main` → `5d84e1a..57e48e4`, **`PUSH_EXIT=0`, 149 s** ; `ls-remote` = `57e48e4` ; `fetch` : `origin/main` = `HEAD`, 0 en avance, 0 en retard.
- **Ce qui est en ligne est mesuré sur une copie fraîche, et c'est la mesure qui répond à « que porte le publié ? ».**
  - preuve : clone à branche unique de l'origine sous `%TEMP%` (`core.longpaths`) : `HEAD` = `57e48e4`, **698 enregistrements, 1 427 fichiers suivis** ; `todo\TODO.jsonl` en ligne : TF-1019 présent (1) ; `todo\CLASSES.json` en ligne : 1.9.0, 66 classes, clé `decision-humaine-rendue-restituee-sans-geste` présente ; `REGLES-PROJET.md` en ligne : paragraphe 5 présent (1) ; `oracle-todo` sur le clone **PASS** ; porte **PASS, 1 constat (le verdict), 0 antériorité, 0 bloquant, 95 s** ; clone supprimé après mesure, verdict conservé dans le bac à sable de session.
- **La restitution précédente de ce tour de matinée est en ligne à jour** (synthèse 20260911b, preuve de son propre push ajoutée).
  - preuve : `git push origin 5d84e1a…:refs/heads/main` → `1fd9fec..5d84e1a`, `PUSH_EXIT=0`, 133 s ; `ls-remote` = `5d84e1a` avant ce tour.

## 5. Non traité — avec son motif

- La publication de cet enregistrement de restitution — motif : `garde_fou`, elle suit ce dépôt par le même geste (R-38 §4, hook `pre-push`) et ne peut pas être sa propre preuve ; `ls-remote` la donne à qui la relit.
- L'oracle « décision reçue, geste absent » dans `hook-restitution` — motif : `gate_gouvernance`, c'est TF-1019, et « décide TF-1019 » est votre mot.
- Les quatre candidatures d'hier (TF-1014 à TF-1017) et la chaîne d'intégration rouge de forge-audit — motif : `gate_gouvernance`, chacune attend « décide TF-#### ».
- Un contrôle exécutable du paragraphe 5 (l'enregistrement poussé ne porte que candidatures, classe, vues) — motif : `borne_atteinte`, la garde de ce tour est un filtre sur les messages d'enregistrement joué à la main avant chaque push ; en faire un oracle est une action neuve, A-2.
- Le relevé d'héritage de l'ouverture (12 produits, 92 manques) — motif : `hors_mandat`, toute écriture chez un produit hors run demandé est interdite par le noyau.
- Le retrait des deux remisages (637 antériorités sur tout verdict local) — motif : `gate_gouvernance`, supprimer est un geste humain selon R-29 (la règle qui réserve à l'humain les dépenses, les portes et les suppressions) ; A-15.
- La dérive du tableau des récidives signalée à l'ouverture (+112 récidives, +35 classes) — motif : `borne_atteinte`, revue des classes hors de la décision du tour.

## 6. Écarts à la lettre

- **Vous avez demandé** « 12a » — étendre la règle et publier l'enregistrement de registre. **J'ai** aussi modifié une ligne du noyau (le renvoi « R-38 §4 » devient « R-38 §4-5 »). **Pourquoi** : le noyau cite le paragraphe qui porte la couverture d'office ; un renvoi qui ignore le paragraphe neuf aurait fait lire la règle ancienne ; l'oracle du noyau est rejoué, PASS.
- **Vous avez demandé** une publication. **J'ai** poussé l'enregistrement de registre ET l'enregistrement de la règle dans le même push. **Pourquoi** : votre décision (a) disait « l'IA amende la règle et publie dans la foulée » — la règle est le contenu que D-12 (a) autorise explicitement ; hors de ce cas, une règle reste au GO explicite, et le paragraphe 5 le dit.
- Aucun autre écart : aucun forçage, sha explicite, porte rejouée par le hook, mesure sur clone frais après, aucune écriture chez un produit ni dans un dépôt frère.

## 7. Risques

- **La borne du paragraphe 5 se juge à la main tant qu'aucun oracle ne la mesure.**
  - signal : un enregistrement qui mêle une candidature et une clôture (ou une règle) poussé sous §5 sans feu vert.
  - parade : la garde de ce tour — lecture des messages d'enregistrement en avance sur l'origine avant chaque push, refus sur « registre NON restitution » hors décision — et A-2 pour l'outiller.
- **Une restitution PASS peut être une non-réponse.**
  - signal : deux fois le même message après deux fois le même mot humain, journal des hooks vert (la mesure de ce matin).
  - parade : TF-1019 (A-1) ; en attendant, un mot de décision reçoit une preuve de geste, jamais la décision reposée.
- **Trois sessions travaillent sur la même copie de travail.**
  - signal : `HEAD` qui avance entre deux commandes d'un même tour ; ici, aucun enregistrement étranger n'est entré entre le commit et le push (2 en avance, les deux de ce tour).
  - parade : sha explicite, état relu juste avant chaque geste, ajout par chemin et jamais global.
- **Chaque verdict local de la porte porte 637 antériorités que le publié n'a pas.**
  - signal : constats en local contre 1 sur le clone frais, même sha.
  - parade : lire les verdicts locaux avec cette réserve ; A-15 retire la cause.
- **La chaîne d'intégration de forge-audit reste rouge et redevient bruit de fond.**
  - signal : le prochain push de forge-audit sans lecture du run hébergé.
  - parade : lire le run après chaque push ; la correction est A-3.

## 8. Prochaines actions

Ce tableau ne liste que les restes ; ce qui est fait est au bloc 4 avec sa preuve.

| # | Action | Acteur | Motif / raison | Effort |
|---|---|---|---|---|
| A-1 | Outiller dans `hook-restitution` le contrôle « décision reçue, geste absent » : lecture du dernier message humain (forme `D-N (x)` / `Nx`), FAIL si le message de fin de tour est identique au précédent ou repose la même D-N, fixture rouge/verte depuis la mesure du 11/09 (TF-1019) | auto_ia | `gate_gouvernance` — attend « décide TF-1019 » ; à défaut, la même boucle reste invisible à l'oracle | moyen × court |
| A-2 | Outiller la borne de R-38 §5 : un contrôle avant push qui classe chaque enregistrement en avance (restitution, candidature seule, décision/clôture/règle) et refuse le push sans GO pour la troisième classe (neuve) | auto_ia | `borne_atteinte` — hors de la décision du tour, garde jouée à la main ici ; à défaut, la borne du paragraphe 5 repose sur la lecture humaine des messages | moyen × court |
| A-3 | Rendre la recette de forge-audit fidèle à l'environnement de la chaîne hébergée et donner un seul verdict aux tests EOL et PDF (TF-1017) | auto_ia | `gate_gouvernance` — attend « décide TF-1017 » ; à défaut, la chaîne hébergée reste rouge et cesse d'être lue | moyen × court |
| A-4 | Tenir ou retirer le journal des versions de forge-audit (TF-1016) | auto_ia | `gate_gouvernance` — attend « décide TF-1016 » ; à défaut, le journal décrit un dépôt figé au 14/08 | simple × court |
| A-5 | Écrire le plafond de longueur de chemin et déclarer `core.longpaths` dans les modes opératoires de clone (TF-1015) | auto_ia | `gate_gouvernance` — attend « décide TF-1015 » ; à défaut, le prochain clone profond échoue chez celui qui vérifie | simple × court |
| A-6 | Faire entrer dans le pack de dimensions de forge-audit le contenu du référentiel du 21/08 (TF-1014) | auto_ia | `gate_gouvernance` — attend « décide TF-1014 » ; à défaut, chaque audit livre un référentiel que le commanditaire ne reconnaît pas | complexe × long |
| A-7 | Reprendre l'héritage des produits relevés à l'ouverture (12 produits, 92 manques ; poser le lanceur de hooks chez celui qui n'en a pas) (neuve) | auto_ia | `gate_gouvernance` — écriture chez un produit hors run demandé, attend un mandat ; à défaut, le relevé se répète à chaque ouverture | moyen × long |
| A-8 | Décider TF-1019 — répondre « décide TF-1019 » ou l'écarter avec son motif (TF-1019) | manuelle_utilisateur | `decision` — tout entre en candidat, la décision est humaine ; sinon : A-1 ne se joue pas | simple × court |
| A-9 | Décider TF-1017 — répondre « décide TF-1017 » ou l'écarter avec son motif (TF-1017) | manuelle_utilisateur | `decision` — idem ; sinon : A-3 ne se joue pas | simple × court |
| A-10 | Décider TF-1016 — répondre « décide TF-1016 » ou l'écarter avec son motif (TF-1016) | manuelle_utilisateur | `decision` — idem ; sinon : A-4 ne se joue pas | simple × court |
| A-11 | Décider TF-1015 — répondre « décide TF-1015 » ou l'écarter avec son motif (TF-1015) | manuelle_utilisateur | `decision` — idem ; sinon : A-5 ne se joue pas | simple × court |
| A-12 | Décider TF-1014 — répondre « décide TF-1014 » ou l'écarter avec son motif (TF-1014) | manuelle_utilisateur | `decision` — idem ; sinon : A-6 ne se joue pas | simple × court |
| A-13 | Donner ou refuser le mandat de reprise d'héritage chez les produits relevés — répondre « mandat A-7 » ou l'écarter (neuve) | manuelle_utilisateur | `decision` — écrire chez un produit hors run demandé est interdit par le noyau sans mandat ; sinon : A-7 ne se joue pas | simple × court |
| A-14 | Jouer la propagation `node bootstrap.mjs --pull`, forge-agents étant publié avec le report (TF-1006) | manuelle_utilisateur | `decision` — la propagation engage toutes les sessions du poste (R-29) ; sinon : la copie installée des skills reste en écart avec sa source | simple × court |
| A-15 | Retirer le remisage du 01/09 si vous le décidez — `git stash drop stash@{0}` puis `stash@{1}` (TF-0995) | manuelle_utilisateur | `decision` — supprimer est un geste humain (R-29) ; sinon : chaque verdict local de la porte porte 637 antériorités que le publié n'a pas | simple × court |

*Ordre* : les actions de l'IA d'abord, puis les vôtres ; à l'intérieur, la dépendance — A-1 et A-3 à A-6 attendent chacune sa décision, A-2 ne dépend de rien, A-7 attend un mandat ; parmi les vôtres, A-8 d'abord parce qu'elle rend la boucle de ce matin visible à l'oracle, A-9 ensuite parce qu'une chaîne d'intégration rouge coûte à chaque push, puis A-10 à A-13 qui n'ont d'autre coût qu'un mot, puis A-14 et A-15.

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - D-12 a executee regle etendue registre publie - 20260911c.md` — ce document.
- `REGLES-PROJET.md` R-38 paragraphe 5 (D-12 (a), 11/09/2026) ; `CLAUDE.md` garde-fou « push sur GO humain (R-38 §4-5) » ; `oracle-claude-md` PASS (6 141 octets) ; enregistrement `57e48e4`.
- Pilot : `git push origin 57e48e4…:refs/heads/main` → `5d84e1a..57e48e4` (`0c464f2` TF-1019 et classe 1.9.0, `57e48e4` règle), 149 s ; `origin/main` = `57e48e4`.
- Clone de vérification à branche unique sous `%TEMP%`, `core.longpaths` : `57e48e4`, 698 enregistrements, 1 427 fichiers, TF-1019 présent, `CLASSES.json` 1.9.0 (66), R-38 §5 présent, `oracle-todo` PASS, porte PASS 1/0/0 en 95 s — supprimé après mesure ; verdict conservé dans le bac à sable de session (`v-pilot-<heure>.porte.json`).
- `output\04-plans\Digit-AI - Synthese Mandat - D-11 a etait executee a 09h10 boucle mesuree et deposee - 20260911b.md` — la synthèse précédente, dont D-12 est la décision exécutée ici, en ligne en `5d84e1a`.
- `input\01-candidatures\decision-humaine-restituee-sans-geste-pilot-20260911a.tf.jsonl` (TF-1019, lot `05840916ff65`) — en ligne.
- Aucun livrable HTML produit dans ce tour ; aucune écriture dans un dépôt frère ni chez un produit.
