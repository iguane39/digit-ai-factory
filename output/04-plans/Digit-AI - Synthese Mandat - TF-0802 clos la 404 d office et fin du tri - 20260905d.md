---
destinataire: humain
---

# Synthèse de mandat — cinquième chantier pilot clos : la 404 devient un standard d'office, et votre tri est épuisé côté pilot (05/09/2026)

Le cinquième et dernier chantier pilot de votre tri est clos et publié, et avec lui les cinq items pilot que vous aviez décidés en bloc sont fermés. La page d'erreur 404 — celle que personne ne conçoit parce que personne ne la visite volontairement — a désormais un lieu de doctrine (un patron éprouvé, avec ses cinq exigences, sa réalisation de référence et son piège mesuré) et un lieu de jugement (un contrôle de mise en production, joué si et seulement si le produit a une surface web). Ce qui change pour vous : un site multilingue créé par la factory ne partira plus en production avec l'erreur nue du serveur, ou alors l'écart sera écrit. Ce qui est attendu de vous : rien pour ce chantier ; deux décisions de confort restent ouvertes dans les synthèses de ce matin, et cinq items de forges attendent leurs mandats.

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-6 (a), chantier 5 sur 5 : instruction et clôture de TF-0802 (la 404 personnalisée, menu et toutes langues, standard d'office pour tout site créé par la factory) ; bilan des cinq chantiers pilot.
- **sur quoi** — le pilot `digit-ai-factory` (référentiel des patrons éprouvés, étape MEP, registre) ; aucun produit ni forge modifié.
- **quand** — fin le **05/09/2026 à 09:50 (UTC+02:00)** ; les quatre chantiers de ce matin ont pris ≈ 1 h 15 au total depuis votre réponse.
- **qui** — Claude Fable 5.1 (extension VS Code), pilot en version `0526e1e` après publication, base `b6b08f7` avant.

## 2. Verdict en une ligne

TF-0802 **corrigé** (patron P-2 (la 404 d'office, par langue, même gabarit) et contrôle M-9 (la 404 jugée à la mise en production) publiés) ; **5/5 chantiers pilot de votre tri clos** (TF-0793, TF-0794, TF-0795, TF-0801, TF-0802), 5 candidatures de forges décidées en attente de mandat, banc 92/93 (défaut préexistant), porte de publication PASS, commit `0526e1e` poussé.

## 3. Décisions attendues

Rien n'attend de décision pour ce chantier. Deux décisions de confort restent ouvertes dans les synthèses précédentes de ce matin : le nom du dépôt de file de tickets (D-7, synthèse 20260905c) et, plus ancien, le sort des trois restes de la racine du parc (A-7).

## 4. Traité — avec sa preuve

- **Le constat relu sur pièce** : le 404 nu du serveur de fichiers (page blanche, sans menu ni langue) servi sur un site multilingue en production du 25/08 au 01/09, vu par l'exploitant ; le mécanisme est générique — aucun gabarit ne génère cette page, aucun oracle ne la juge, aucune revue ne la voit.
  - preuve : lot du produit 02 (candidature TF-0802, entrée de journal seq 76 du 01/09) ; la recherche du mot « 404 » dans `references\`, `gabarits\`, `oracles\` et le contrat du pilot est la seule sonde jouée, et cette source me montre huit mentions, toutes de sondes ou d'interfaces, et aucune page à livrer.
- **Patron P-2 écrit** (référentiel v1.1.0, contrôle du noyau PASS) — classe : la surface implicite qu'aucune demande de fonctionnalité ne laisse émerger (loi transverse n° 3) ; contrôle rouge → vert : aucun lieu de doctrine → un patron numéroté avec fait, cinq exigences mesurables (une 404 par langue du même gabarit ; statut 404 conservé ; `noindex` et exclusion du sitemap déclarée ; langue au préfixe ; contrôle exécutable jouant trois cas), réalisation de référence, piège mesuré (réponse pendue si l'écriture du corps n'est pas enveloppée), exclusions écrites, non éprouvé ailleurs déclaré.
  - preuve : `references\PATRONS-EPROUVES.md` v1.1.0, § P-2 ; référence citée par le noyau via l'index, contrôle du noyau PASS.
- **Contrôle M-9 ajouté à l'étape de mise en production** : si et seulement si le produit a une surface web, sur l'instance de préproduction servie — adresse inconnue sous chaque préfixe de langue → 404 avec page du même gabarit dans la langue ; `noindex` et exclusion déclarée ; ressource non-HTML inconnue → 404 nu ; preuve exigée : sortie du contrôle exécutable du produit.
  - preuve : `ETAPE-MEP.md`, tableau des contrôles, ligne M-9 ; sidecars de verdict régénérés.
- **TF-0802 clos avec sa descente** (événement journalisé, verdict PASS, registre 13 ouverts et 8 fermés) — classe : la surface implicite qu'aucune demande ne laisse émerger ; contrôle rouge → vert : aucun lieu de doctrine ni de jugement → patron P-2 publié et M-9 au tableau de la MEP. L'événement de clôture porte corrections, gains (déclarés non mesurés ailleurs que sur le produit d'origine), version corrigée, produits bénéficiaires et la règle retenue.
  - preuve : événement de clôture journalisé (verdict PASS) ; vues régénérées (13 ouverts, 8 fermés).
- **Bilan des cinq chantiers pilot** : déclaration de racine web lue (TF-0793), rectification de seq consommée (TF-0794), chemin d'échec exigé des contrôles (TF-0795), clé de versions rectifiable et file de tickets nommée (TF-0801), 404 d'office (TF-0802).
  - preuve : cinq événements « corrigé » au registre ; recettes 19 → 23 (relevé d'héritage), 45 → 52 (conformité), 19 → 22 (contrôles injoignables), 6 → 9 (noyau) ; banc 92/93.
- **Publication** en avance rapide, porte de publication verte.
  - preuve : `oracle-nom-client-publie` PASS sur un clone à branche unique ; `git push` → `b6b08f7..0526e1e main -> main`.

## 5. Non traité — avec son motif

- **Le contrôle exécutable générique de la 404** (jouer les trois cas sur n'importe quel produit) : *hors mandat* — il relève de forge-tests ou de forge-ops ; M-9 exige la preuve, le produit la fournit avec son propre contrôle.
- **La 404 dans la surface implicite proposée d'office à la conception** : *hors mandat* — le skill qui énumère la surface vit chez forge-conception ; candidature à porter chez elle.
- **La mesure du patron sur un autre produit** : *impossible à prouver ici* — un seul produit l'a joué ; déclaré non éprouvé ailleurs dans le patron lui-même.
- **Les cinq candidatures de forges décidées** (trois design, une développement, une conception) : *hors mandat* — écriture chez une forge sur mandat propre.
- **Le remède de l'oracle des skills** (règle K2 (les empreintes des skills installés sur le poste sont relevées à l'ouverture)) : *hors mandat* — non sélectionné ; seul défaut du banc, préexistant.

## 6. Écarts à la lettre

- Le lot proposait un « standard » en cinq exigences → il entre comme patron éprouvé (doctrine) et comme contrôle de MEP (jugement), pas comme règle du socle projet → parce qu'un standard sans lieu de jugement décore, et que la MEP est le seul moment où l'instance servie existe pour le prouver.
- Vous avez demandé une synthèse par chantier clos → les trois derniers chantiers partent dans une seule publication, chacun avec sa synthèse → parce que les recettes et le banc se rejouent une fois pour les trois ; les synthèses restent distinctes et datées.

## 7. Risques

- **Un produit sans contrôle exécutable de sa 404** ne peut pas fournir la preuve de M-9.
  - signal : dossier de MEP sans sortie de contrôle pour M-9 alors que le produit a une surface web.
  - parade : la preuve exigée est écrite ; le GO humain reste la porte ; le contrôle générique est une candidature à porter chez forge-tests.
- **Le patron réappliqué hors de son domaine** (API JSON, routeur qui a déjà sa page).
  - signal : une 404 HTML servie par une interface de programmation, confirmée par deux appels (GET et HEAD).
  - parade : les exclusions sont écrites dans P-2, comme le référentiel l'exige.
- **Les cinq items de forges sans porteur** se reproduisent aux prochains runs.
  - signal : les mêmes constats dans les prochains lots de retours.
  - parade : mandats chez les forges (bloc 8).

## 8. Prochaines actions

Ordre de traitement : d'abord les cinq candidatures de forges, parce qu'elles sont décidées et que leurs défauts se reproduisent à chaque run ; puis les décisions et gestes humains ouverts, sans urgence.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-13 | TF-0796, TF-0797, TF-0800, TF-0798, TF-0799 | Mandater un run chez forge-design (trois items : habillage complet d'un composant généré, sémantique des déclencheurs, bascule déclarée morte à tort), forge-development (adresses de fichiers statiques versionnées) et forge-conception (frontières Unicode des gardes lexicales, plus la 404 dans la surface implicite d'office). | `auto_ia` | `hors_mandat` — écriture chez une forge : mandat propre à chaque forge (boucle mandatée, journalisée). | Les cinq items restent décidés sans porteur ; les défauts de rendu et de garde lexicale se reproduisent aux prochains runs. |
| A-18 | `neuve` | Verser chez forge-tests la candidature : un contrôle exécutable générique de la 404 (adresse inconnue par langue, préfixe, non-HTML nu, statut et `noindex`), consommable comme preuve de M-9. | `auto_ia` | `hors_mandat` — dépôt frère, mandat propre à forge-tests. | Chaque produit réécrit son propre contrôle, ou n'en a pas et ne peut pas prouver M-9. |
| A-17 | `neuve` | Si D-7 (b) de la synthèse 20260905c : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7, posée dans la synthèse 20260905c. | Rien : l'exception tient. |
| A-1 | `neuve` | Rejouer le remède de l'oracle des skills : `node oracles\oracle-skills.mjs --racine "C:\dev"` puis relire son verdict (règle K2). | `auto_ia` | `hors_mandat` — préparation du poste, non sélectionné. | La garde d'ouverture annonce « poste non prêt » ; banc à 92/93. |
| A-14 | TF-0794 | Depuis le produit 02, ajouter à `forge\ledger.jsonl` une entrée `type: rectification_horodatage` avec `entrees: [{seq: 76, cause: …}, {seq: 77, cause: …}]`, puis rejouer `node <PILOT_ROOT>\oracles\oracle-conformite-projet.mjs .` jusqu'à R-42 (l'intégrité du journal de run) PASS. | `manuelle_utilisateur` | `decision` — le pilot n'écrit pas chez un produit (mandat du 23/08) ; trace mesurée : la même entrée jouée sur copie rend PASS. | Le produit 02 garde un R-42 rouge à chaque conformité. |
| A-16 | TF-0795 | Depuis le produit 02, donner à ses deux contrôles statistiques une sortie non nulle sous condition et une recette double sens, puis rejouer l'oracle des contrôles injoignables jusqu'à CI5 (chaque contrôle possède un chemin d'échec) PASS. | `manuelle_utilisateur` | `decision` — le pilot n'écrit pas chez un produit ; trace mesurée : CI5 FAIL nommant les deux fichiers. | Deux contrôles continuent de rassurer sans juger. |
| A-6 | `neuve` (reprise de la synthèse 20260903d) | Sur l'autre poste, avant tout travail : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot, puis vérifier que la garde d'ouverture rend « à jour ». | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | La prochaine publication depuis l'autre poste est refusée, ou forcée par-dessus les enregistrements récents. |
| A-7 | `neuve` (reprise de la synthèse 20260903d) | Décider du sort des trois restes de la racine du parc : la seconde copie du pilot, le fichier « null » (à lire avant suppression), le lien brisé. | `manuelle_utilisateur` | `irreversible` — trois suppressions, R-29 ; la garde les déclare et ne les efface pas. | La garde d'ouverture répète les trois avertissements à chaque session. |

## 9. Traces

- Publication : commit `0526e1e` sur `main`, poussé (`b6b08f7..0526e1e`), 26 fichiers ; les clôtures de TF-0795, TF-0801, TF-0802 et les synthèses 20260905b, c, d partent dans le commit suivant.
- Doctrine : `references\PATRONS-EPROUVES.md` v1.1.0 (§ P-2) · `ETAPE-MEP.md` (M-9).
- Synthèses du tour : `output\04-plans\…20260905a.md` (TF-0794) · `…20260905b.md` (TF-0795) · `…20260905c.md` (TF-0801, décision D-7) · cette synthèse (TF-0802).
- Registre : `todo\TODO.jsonl` — événements « corrigé » TF-0795, TF-0801, TF-0802 ; vues `todo\TODO.md`, `todo\AVANCEMENT.md` régénérées.
- Oracles rejoués : `oracle-nom-client-publie` (PASS) · `oracles\oracle-claude-md.mjs` (PASS) · `oracles\self-tests.mjs` (92/93) · `todo\oracle-todo.mjs` (PASS).
