---
destinataire: humain
---

# Synthèse d'exécution — vos trois décisions sont jouées : le verdict de l'étude est retenu et inscrit, sept candidatures sont au registre, tout est enregistré localement ; une de mes candidatures a dû être rectifiée dans l'heure, et la page de l'étude passe désormais aussi la critique de forge-design (19/09/2026)

Vos trois réponses sont exécutées. L'étude porte maintenant votre validation : le verdict est retenu tel quel, la mission réelle d'abord, l'extraction du skill ensuite. Les quatre lots et les trois constats sont entrés au registre en simple candidature, et l'ensemble des fichiers de la session est enregistré dans l'historique local du pilot, sans publication. Deux choses ont changé en chemin, et vous devez les connaître. La première est une erreur de ma part : le registre, en ingérant mes candidatures, m'a signalé qu'un de mes constats ressemblait à un défaut déjà corrigé le 8 septembre ; vérification faite, j'avais lancé les contrôles de forge-design un par un au lieu de passer par son point d'entrée, qui sait déjà ne pas imputer à l'auteur d'une page les fichiers du socle. J'ai rectifié la candidature au registre et corrigé la page, qui passe maintenant cette critique. La seconde : ce travail a fait apparaître deux nouveaux désaccords entre contrôles, que je n'ai pas déposés. Ce qui est attendu de vous : dire ce que devient la candidature rectifiée, dire si ces deux constats entrent au registre, et lancer la mission quand vous le voudrez.

## 1. En-tête d'identification

- **quoi** — exécution de trois décisions humaines rendues en sélecteurs (« 3a, 4a, 2a ») : inscription de la validation dans l'étude d'opportunité, dépôt et ingestion de sept candidatures, enregistrement local ; rectification d'une candidature ; correction de la page HTML de l'étude.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; lectures seules sur forge-design (oracles) et sur les skills installés.
- **quand** — 2026-09-19 15:26 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour à 15:14 (horodatage de l'ingestion au registre) ; durée mesurée ≥ 12 min.
- **qui** — session Fable 5.1 sur le pilot local, de `1514d3e4` à `9d2b1a60` ; aucune délégation (escalade : aucune) ; outils joués : `todo\ingerer-lot.mjs`, `todo\journaliser.mjs`, générateurs de vues, `todo\oracle-todo.mjs`, `oracle-etude-opportunite`, `check_markdown.py`, `check_html.py`, `render_page.py`, `oracle-filtres-tableau`, parité des composants, `run-oracles-design` de forge-design, lanceur `run-oracles.mjs`, puis `oracle-synthese` sur ce document.

## 2. Verdict en une ligne

**3 décisions exécutées sur 3 ; 7 candidatures ingérées en candidat (TF-1106 à TF-1112, lot ab77982dc37d, 5 marquées récidive de classe), 1 rectifiée par événement journalisé (TF-1110), `oracle-todo` PASS, vues régénérées à 330 actifs ; enregistrement local `9d2b1a60` de 34 fichiers, 0 push ; étude `oracle-etude-opportunite` PASS après inscription de la validation ; page HTML : `run-oracles-design` de forge-design passé de FAIL à PASS sur 7 oracles, 22 constats imputés au socle et 0 à la page, les cinq contrôles du socle toujours PASS ; journal du lanceur général NON CONFORME sur 3 oracles, tous trois expliqués au bloc 5.**

## 3. Décisions attendues de l'humain

Deux décisions neuves. Les trois décisions auxquelles vous venez de répondre sont exécutées et ne sont pas reposées ; celle du premier tour, sur le lancement de la mission, reste ouverte et figure au bloc 8.

> **D-5 — Que devient la candidature que j'ai dû rectifier, sur le socle de page et le contrôle des jetons ?**
>
> J'avais déposé un constat disant qu'une page bâtie sur le socle échoue au contrôle des jetons de forge-design sans que son auteur puisse rien corriger. C'était faux pour vingt des vingt-deux écarts : le remède existe depuis le 8 septembre, et il suffisait de lancer la critique par son point d'entrée. Ce qui reste vrai est plus petit : le gabarit du socle porte trois couleurs de repli écrites en dur, recopiées dans toute page, que chaque auteur doit retirer lui-même. La candidature est rectifiée au registre en ce sens, gravité ramenée à mineur ; sa classe ne convient plus.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md` (« un quasi-doublon reste une piste de rapprochement, jamais un refus ») et l'événement de correction de l'item du 8 septembre au registre, qui ne traite que les composants scellés, pas le gabarit. Le reste de constat est réel et mesuré : trois écarts bloquants retirés à la main sur la page de ce jour.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** garder la candidature, réduite aux trois replis en dur du gabarit, et la reclasser | effort simple × court (un événement au registre) | exclut de compter ce constat comme une contradiction entre règles : il devient un défaut mineur du gabarit |
| **(b)** l'écarter comme doublon de l'item du 8 septembre, motif nommé | effort simple × court | exclut la trace des trois replis en dur : ils resteraient à la charge de chaque auteur, sans item |

> **Si rien n'est décidé** : la candidature reste en candidat, rectifiée, sous une classe qui ne lui convient plus.

> **D-6 — Les deux désaccords entre contrôles apparus pendant ce tour entrent-ils au registre ?**
>
> En produisant le journal de contrôle de la page, deux faits neufs sont apparus. Le lanceur général des oracles lance le contrôle des jetons et celui des marqueurs de forme sans la passe qui impute au socle ses propres fichiers : il déclare donc non conforme une page que le point d'entrée de forge-design déclare conforme. Et le contrôle du contrat mobile exige le repli des tableaux en cartes dans une règle à 768 pixels au plus, quand le socle le pose à 900 pixels, donc actif à 768 : il refuse le geste même que le socle prescrit. Je ne les ai pas déposés : votre accord de tout à l'heure portait sur sept items nommés.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fous (« constat en passant → candidat »), `references\TODO-FORGE.md` (« tout entre en candidat, décision humaine »), et les sorties des deux contrôles dans ce tour. Deux juges qui se contredisent sur une page conforme apprennent à leurs auteurs à ignorer l'un des deux.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** déposer et ingérer ces deux constats, en candidat | effort simple × court | exclut toute exécution : chaque item attend sa décision |
| **(b)** ne pas les déposer | effort nul | exclut leur mémoire : ils ne vivent que dans cette synthèse et dans le journal de la page |

> **Si rien n'est décidé** : l'option (b) s'applique — rien n'entre au registre.

## 4. Traité — avec sa preuve

- **Décision sur le verdict de l'étude, option (a) — exécutée** : l'étude porte « validée par le demandeur le 19/09/2026 », et sa ligne de candidatures nomme le fichier déposé.
  - preuve : `node oracles\oracle-etude-opportunite.mjs` sur l'étude modifiée → verdict PASS ; `check_markdown.py` → « Verdict : PASS » ; page HTML régénérée depuis cette source.
- **Décision sur le registre, option (a) — exécutée** : sept candidatures déposées et ingérées, quatre lots (forge-agents, forge-audit, forge-design, pilot) et trois constats.
  - preuve : `node todo\ingerer-lot.mjs … --sans-fetch` → « [OK] 7 candidature(s) ingérée(s) en CANDIDAT (lot ab77982dc37d) — la décision reste humaine », exit 0 ; identifiants lus au registre : TF-1106 à TF-1112 ; cinq avis de récidive de classe et deux avis de classe suspecte rendus par l'ingestion, qui sont des compteurs du tableau de bord et non des refus.
- **Les vues du registre sont régénérées et le registre est jugé.**
  - preuve : « TODO.md générée — 330 actifs, 21 forges cibles (sceau actifs a160de7766f8) » ; « TODO.html générée — 330 items » ; « RECIDIVES.md : 74 classe(s), 154 récidive(s), 26 relevé(s) » ; `node todo\oracle-todo.mjs` → verdict PASS, exit 0.
- **Une candidature rectifiée dans l'heure, sur la piste rendue par l'ingestion elle-même** (rapprochement avec un item corrigé le 08/09, recouvrement 0,242).
  - preuve : `node todo\journaliser.mjs --fichier …` → « 1 événement(s) journalisé(s) », ligne « TF-1110 maj candidat », verdict du registre PASS avant et PASS après.
- **Correction de la page de l'étude, contrôle passé du rouge au vert** : trois couleurs de repli en dur héritées du gabarit retirées à la génération (classe : repli en dur recopié du gabarit).
  - preuve : `node oracles\run-oracles-design.mjs` de forge-design sur la page → FAIL avec 3 constats durs au compte de l'auteur avant, PASS sur 7 oracles après, 2 composants vérifiés contre leur source et 22 constats imputés au socle ; `check_html.py` PASS, `render_page.py` PASS à six largeurs, matrice d'états PASS, `oracle-filtres-tableau` PASS, parité « 2 copie(s) à la parité de leur source ».
- **Décision sur l'enregistrement, option (a) — exécutée** : un enregistrement local des seuls chemins de la session, sans push.
  - preuve : `git commit` → `9d2b1a60`, « 34 files changed, 3250 insertions(+), 43 deletions(-) » ; `git status --short` après coup ne liste plus que des chemins d'autres sessions (un dossier de travail d'agent, deux fichiers d'audit d'un autre produit, une synthèse du matin et ses trois journaux).
- **Le journal de contrôle de la page est produit**, comme l'exige la règle sur les pages HTML déposées.
  - preuve : lanceur `run-oracles.mjs` → journal écrit sous `.oracles\output\03-etudes\`, 9 PASS, 6 SKIP, 3 en échec expliqués au bloc 5.

## 5. Non traité — avec son motif

- Les trois échecs du journal du lanceur général sur la page — motif : bloqué par un garde-fou, et impossible à corriger côté page. Deux (marqueurs de forme, jetons) sont les constats des fichiers du socle, que le lanceur général lance sans la passe d'imputation ; le troisième (contrat mobile) exige un seuil de 768 pixels quand le socle prescrit 900. Une retouche essayée pour le contrat mobile a fait basculer la page en cible mobile et échouer le point d'entrée de forge-design : je l'ai retirée, contrôle revenu de FAIL à PASS.
- Le dépôt des deux constats neufs — motif : dépendance à une décision humaine (D-6).
- Le reclassement ou l'écartement de la candidature rectifiée — motif : dépendance à une décision humaine (D-5).
- Le push — motif : bloqué par un garde-fou ; l'enregistrement porte des livrables, donc feu vert humain explicite, et le relevé d'ouverture donnait le pilot divergé de son origine (16 devant, 96 derrière au matin), ce qui relève de la synthèse du jour sur la synchronisation.
- Le lancement de la mission réelle avec le prompt réécrit — motif : dépendance à une décision humaine (celle du premier tour, toujours ouverte) ; c'est elle qui conditionne tout le séquencement retenu.

## 6. Écarts à la lettre

- **Vous avez écrit** « 4a » → **j'ai déposé** les sept items, puis **rectifié l'un d'eux** par un événement au registre → **pourquoi** : le registre est en ajout seul ; une candidature fausse ne s'efface pas, elle se rectifie, et c'est l'ingestion elle-même qui a rendu la piste.
- **Vous avez écrit** « 2a » → **j'ai enregistré** aussi les index de dossiers et les vues du registre régénérés, dont deux index qui listent un fichier d'une autre session non encore enregistré → **pourquoi** : ces fichiers sont générés depuis l'état du disque ; les écarter aurait laissé l'arbre sale sans rien protéger.
- **Vous avez écrit** « 3a » → **j'ai inscrit** la validation dans l'étude sans toucher au verdict → aucun écart.
- J'ai de nouveau corrigé la page de l'étude sans que vous l'ayez demandé dans ce message → **pourquoi** : la rectification de mon constat passait par la preuve que la page pouvait être verte ; le Markdown de l'étude, lui, n'a changé que de deux phrases.

Intention : « 3a, 4a, 2a » — vos mots sont des sélecteurs ; l'intention qu'ils portent est celle des trois décisions posées : retenir le verdict, faire entrer les lots et constats au registre, garder une trace locale.

Test rétro : les trois gestes sont prouvés au bloc 4 et servent chacun sa décision ; ce qui ne la sert pas encore : une des sept candidatures est entrée fausse et a dû être rectifiée, et la décision qui fait vivre tout le reste — lancer la mission — n'est pas encore prise.

## 7. Risques

- La candidature rectifiée reste lue dans sa première version ;
  - signal : un lecteur du registre cite « vingt-deux écarts incorrigibles » ;
  - parade : l'événement de rectification est au registre, daté, et D-5 propose de la reclasser ou de l'écarter.
- Le journal non conforme de la page est lu comme un défaut de la page ;
  - signal : une revue qui rejette la page sur la foi du lanceur général ;
  - parade : le verdict du point d'entrée de forge-design est consigné ici avec ses chiffres ; D-6 propose de faire entrer le désaccord au registre.
- La critique d'implémentation est de nouveau lancée oracle par oracle par une autre session ;
  - signal : un FAIL de jetons portant sur des sélecteurs du composant de filtres ;
  - parade : la rectification au registre le note ; la grille du skill de critique liste les oracles un par un sans nommer le point d'entrée.
- L'enregistrement local s'ajoute à un pilot déjà divergé de son origine ;
  - signal : le relevé d'ouverture affiche un écart plus grand ;
  - parade : acceptation déclarée ; la réconciliation appartient au mandat de synchronisation en cours.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, par décision attendue ; puis les actions humaines, le lancement de la mission en dernier parce que le séquencement retenu en dépend entièrement.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-8 | Journaliser au registre le sort de la candidature rectifiée, reclassée ou écartée avec son motif, régénérer les vues, rejouer `oracle-todo` (TF-1110) | auto_ia | `dependance_bloc_3` — attend D-5 | simple × court | l'item reste sous une classe qui ne lui convient plus |
| A-9 | Déposer et ingérer les deux constats neufs, régénérer les vues, rejouer `oracle-todo`, enregistrer localement (neuve) | auto_ia | `dependance_bloc_3` — attend D-6 (a) | simple × court | les deux désaccords ne vivent que dans cette synthèse |
| A-10 | Trancher D-5 — répondre « D-5 (a) » ou « D-5 (b) » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — le sort d'un item du registre est une décision humaine | simple × court | la candidature reste en l'état |
| A-11 | Trancher D-6 — répondre « D-6 (a) » ou « D-6 (b) » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — l'accord donné portait sur sept items nommés, pas sur ceux-ci | simple × court | rien n'entre au registre |
| A-7 | Lancer la mission : ouvrir une session Claude Code dans le dossier de la plateforme et y lancer le prompt réécrit du premier tour ; preuve de clôture : la session rend ses cinq questions d'ouverture (neuve) | manuelle_utilisateur | `decision` — le lancement d'un run est un feu vert humain | simple × court | le skill n'a aucune mission dont s'extraire, et la revue du 2026-10-01 trouve un run de conseil jamais exercé |

## 9. Traces

- Enregistrement local : `9d2b1a60` (34 fichiers) ; cette synthèse, son journal et les index régénérés sont enregistrés à sa suite, sous la même décision.
- Candidatures : `input\01-candidatures\plan-d-amelioration-post-audit-20260919a.tf.jsonl` (lot ab77982dc37d) ; registre `todo\TODO.jsonl` (TF-1106 à TF-1112, rectification de TF-1110) ; vues `todo\TODO.md`, `todo\TODO.html`, `todo\RECIDIVES.md`.
- Étude et page : `output\03-etudes\20260919-etude-opportunite-plan-d-amelioration-post-audit.md` et `.html` — verdict de la critique d'implémentation de forge-design du 19/09/2026, par `run-oracles-design` (mode dégradé déclaré, sans artefact de design de run) : PASS sur 7 oracles, 22 constats imputés au socle, 0 à la page ; ce verdict remplace celui de la synthèse précédente, rendu à tort oracle par oracle.
- Journal de contrôle de la page : `.oracles\output\03-etudes\20260919-etude-opportunite-plan-d-amelioration-post-audit.html.oracles.json`.
- Synthèse précédente : `output\04-plans\Digit-AI - Synthese Etude - Plan d amelioration post-audit verdict O2 forges impliquees - 20260919c.md`.
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Etude - Decisions 3a 4a 2a executees sept candidatures au registre - 20260919d.md`.
