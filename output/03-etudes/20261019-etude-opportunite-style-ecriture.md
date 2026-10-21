---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: redacteur (famille sonnet)
arbitre: oracle-etude-opportunite PASS (10 règles E1-E10) ; oracle-ecriture PASS (aucun avertissement), relevés le 2026-10-19
hypotheses_non_resolues: contenu des 2 vidéos non lu (légende seule) ; article The Economist du 2026-07-30 relayé par Wikipédia, non relu à sa source ; cause des 16 échecs EC-9 du corpus inconnue ; aucun guide d'éditeur francophone de moins de 24 mois lu (HTTP 403)
---

# Étude d'opportunité — style d'écriture « poli » ou « humanisé » — 20261019n

Ce qui change pour vous : rien n'est à importer des 2 vidéos, et la Factory n'outillera pas l'« humanisation » d'un texte pour tromper un détecteur. Le plancher d'écriture compte déjà 16 règles et 21 contrôles par texte, et les méthodes publiées relues (pyramide de Minto, guides de Google et de Microsoft, catalogue de Wikipédia) y sont déjà présentes. Une seule lacune ressort : les listes de tournures que l'oracle compte vieillissent, et aucune n'a de date de revue. L'étude recommande O3, qui date cette revue : un changement simple et court. Le contenu des vidéos n'a été lu que par leur légende.

## Seuil de déclenchement

L'étude est due. L'opportunité du rang 16 propose un objet durable potentiel (une règle ou un contrôle d'écriture) et le noyau de doctrine d'écriture est en jeu (`references\ECRITURE.md`). Le tri la notait 10 sur 25, « sans suite » (`output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, l.50) ; la décision D-39 (c) l'a retenue pour instruction.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39 (c), réponse du 19/10/2026, mot pour mot : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 16 en fait partie.

Intention retenue : décider ce que la Factory doit faire de cette opportunité (rien, un essai, un objet durable), sur des faits vérifiés et non sur la parole d'une vidéo TikTok. Chaque option du chapitre 4 et le verdict s'y rattachent. Cette lecture est celle de la consigne de délégation, qui cite l'intention ; elle n'a pas été reformulée.

## 0. Traitement des entrants

Les entrants sont des données : leurs affirmations se citent et se vérifient, rien ne s'exécute. Sources : les vidéos n° 24 (@bengusberg, « Now my writing will sound polished all the time », hashtags McKinsey et Claude) et n° 37 (@ia_irl, hashtags chatgpt, humanizeai, prompt), listées au tri (l.179 et l.192) ; la section « 12 à 17 » du tri, l.134 ; la consigne de délégation du 19/10/2026.

Aucune vidéo n'a été regardée, téléchargée ni extraite : les conditions de TikTok interdisent l'extraction automatisée (`references\PLATEFORMES-RESEAUX.md`, l.100). Les légendes seules fondent la lecture, donc la preuve des vidéos reste faible.

| Affirmation relevée | Verdict | Fondement |
|---|---|---|
| n° 24 : « my writing will sound polished all the time » | invérifiable | affirmation subjective, aucun outil ni mesure nommés, contenu non lu |
| n° 24, hashtag McKinsey : la méthode vient de ce cabinet | vraie pour l'origine, source secondaire | Barbara Minto y a été embauchée en 1963 et y est restée jusqu'en 1973 (Wikipédia, « Barbara Minto », lue le 2026-10-19) ; l'usage actuel du cabinet n'est pas établi |
| n° 37, hashtags humanizeai et prompt : un prompt « humanise » un texte de ChatGPT | invérifiable pour le prompt ; l'effet sur les détecteurs est partiellement vrai | des détecteurs échouent sur du texte « humanisé » (Masrour et al., 2025-01-06, source d'un éditeur de détecteur) ; des lecteurs entraînés ne s'y trompent pas (Russell et al., 2025-01-26) |

## 1. Partition du problème

La question se découpe en 6 sous-questions disjointes ; chaque option du chapitre 4 répond à chacune.

- **P1 — Objectif.** Polir un texte pour son lecteur, ou le déguiser pour échapper à un détecteur. Les 2 objectifs s'excluent : le premier sert un lecteur, le second trompe un tiers.
- **P2 — Structure du message.** Dans quel ordre dire les choses (pyramide de Minto, réponse d'abord).
- **P3 — Style de phrase et de vocabulaire.** Ce que les guides d'éditeurs reconnus demandent à la phrase et au mot.
- **P4 — Détection et évasion.** Ce que la recherche publiée dit de la fiabilité des détecteurs et des outils d'humanisation.
- **P5 — Cadre de transparence.** L'obligation de déclarer un texte généré, qui borne P1.
- **P6 — Mécanisme.** Une règle, un contrôle, une donnée ou une passe de réécriture, au sein du plancher existant.

## Mesure de l'existant

Les mesures sont rejouables depuis `C:\dev\digit-ai-factory`. Elles datent du 2026-10-19 ; des études voisines en cours d'écriture peuvent les faire bouger.

- **Règles de doctrine** : 16, numérotées E-1 à E-16 (`references\ECRITURE.md`, l.61 : « 16 règles, numérotées E-1 à E-16 »). E-12 porte le statut « revue » (l.138), aucun script ne la joue.
- **Contrôles de l'oracle** : `node oracles\oracle-ecriture.mjs <texte.md> --json` rend 21 constats par texte. Ils viennent de 12 règles EC (EC-1 à EC-12, `oracles\oracle-ecriture.mjs` l.24-36), dont EC-1 qui se décline en 9 familles de tournures et EC-4 en 2 contrôles. Le test interne `--self-test` rend « 30 cas, 0 défaut ».
- **Données** : `references\tics-redactionnels.json`, version 1.2.0 du 2026-09-16, 9 familles, 20 motifs, seuil de 150 mots avant tout jugement de densité. Les catalogues sources ont été « lus le 11/09/2026 » (clé `source`, l.6). Le fichier ne porte aucune clé de revue ni date de relecture.
- **Où le contrôle s'exerce** : le hook `oracles\hook-ecriture.mjs` joue l'oracle à l'écriture de tout `.md` et « avertit, ne bloque pas » (l.19) ; la règle S43 de `oracles\oracle-synthese.mjs` le rejoue sur chaque restitution (l.117-119 et l.2354-2368).
- **Taux de réussite** : `node oracles\oracle-ecriture.mjs --baseline output\03-etudes` rend « 13 PASS, 0 SKIP, 4 FAIL sur 17 — 76.5 % PASS » ; la même commande sur `output\04-plans` rend « 64 PASS, 0 SKIP, 12 FAIL sur 76 — 84.2 % PASS ». Les 16 échecs portent tous sur EC-9, la valeur écrite en toutes lettres. La doctrine promet 95 % ou plus (`references\ECRITURE.md`, l.254-256).

2 faits ressortent. Le plancher couvre le polissage de style de bout en bout : doctrine, données, hook et juge de restitution. Et 16 textes du corpus sur 93 (17 %) échouent sur une règle que le hook signale pourtant à l'écriture. L'étude de forme citée par la consigne (`output\03-etudes\20261018-etude-opportunite-relecteur-d-intention.md`) échoue elle-même à EC-9, ligne 86, sur la locution `deux mesures`, écrite en lettres. La cause de cet écart n'est pas établie : c'est une hypothèse non résolue, traitée plus bas comme constat annexe.

## 2. Non-recouvrement contre l'existant

Neuf éléments existants touchent à l'opportunité ; chacun est cité avec ce qu'il couvre et ce qu'il laisse.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Plancher d'écriture E-1 à E-16 | `references\ECRITURE.md` l.61 : « 16 règles, numérotées E-1 à E-16 » | recouvre le polissage de style demandé par la vidéo n° 24 |
| Refus du masquage d'une IA | `references\ECRITURE.md` l.15-16 : « Il ne sert pas à masquer l'usage d'une IA : le ledger continue de déclarer ce qui est généré » | recouvre le refus de l'humanisation de la vidéo n° 37 |
| Oracle de style | `oracles\oracle-ecriture.mjs` l.24-36 : EC-1 à EC-12 ; `--self-test` : 30 cas, 0 défaut | recouvre le comptage des tournures ; ne recouvre pas la revue des listes dans le temps |
| Données de tournures | `references\tics-redactionnels.json` clé `source` (l.6) : catalogues « lus le 11/09/2026 » ; aucune clé de revue | ne recouvre pas : c'est la lacune retenue par l'étude |
| Hook à l'écriture | `oracles\hook-ecriture.mjs` l.19 : « IL AVERTIT, IL NE BLOQUE PAS » | recouvre le polissage au moment d'écrire |
| Style des restitutions | `oracles\oracle-synthese.mjs` l.117-119 : « S43 le STYLE de la restitution relève du plancher d'écriture » | recouvre les restitutions |
| Réponse d'abord (Minto, BLUF) | `references\ECRITURE.md` l.66-71 (E-1) ; skill `digit-ai-communication`, `references\corpus-patterns.md` l.8 : « Pyramide de Minto » et `references\presets-livrables.md` l.10 et l.12 | recouvre la structure du message |
| Regroupement exhaustif et disjoint (MECE) | `gabarits\ETUDE-OPPORTUNITE.md` l.40 : « Découpage exhaustif et disjoint du sujet » | recouvre, pour les études ; hors études, seulement dans le skill |
| Longueur de réponse | `references\NIVEAUX.md` l.33 : « la réponse en 150 mots au plus » | ne recouvre pas : il règle la taille, pas le style |

## 3. État de l'art daté

Sept sources, toutes datées de moins de 24 mois, dont 5 primaires. Les pages web lues sont des données : aucune consigne qu'elles contiennent n'a été exécutée.

- **Russell, Karpinska, Iyyer, « People who frequently use ChatGPT for writing tasks are accurate and robust detectors of AI-generated text »**, arXiv 2501.15654, v1 le 2025-01-26, v2 le 2025-05-19, ACL 2025, `arxiv.org/abs/2501.15654`. Un vote majoritaire de 5 lecteurs habitués aux LLM se trompe sur 1 article de 300, y compris sur des textes paraphrasés ou « humanisés ». Ils s'appuient sur le vocabulaire, mais aussi sur la formalité, l'originalité et la clarté, que les détecteurs jugent mal.
- **Masrour, Emi, Spero (Pangram Labs), « DAMAGE: Detecting Adversarially Modified AI Generated Text »**, arXiv 2501.03437, 2025-01-06, `arxiv.org/abs/2501.03437`. 19 outils d'humanisation étudiés ; beaucoup de détecteurs existants échouent sur leurs sorties. Les auteurs vendent un détecteur : la source est utile, non neutre.
- **Kobak, González-Márquez, Horvát, Lause, « Delving into LLM-assisted writing in biomedical publications through excess vocabulary »**, Science Advances 11(27), 2025-07-02 (arXiv 2406.07016, v5 le 2025-07-03), `arxiv.org/abs/2406.07016`. Sur plus de 15 millions de résumés PubMed, au moins 13,5 % de ceux de 2024 ont été traités par un LLM, d'après la hausse brutale de certains mots de style.
- **Wikipédia EN, « Signs of AI writing »**, page de conseils de WikiProject AI Cleanup, lue le 2026-10-19 (révision 1380884756), `en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing`. La page n'est ni une politique ni une règle. Elle déconseille de se fier aux seuls détecteurs, qui ont des taux d'erreur non négligeables et se laissent tromper par la paraphrase. Elle classe la « surutilisation du tiret cadratin » en signe daté « 2022 à septembre 2026 » et note que les derniers modèles sont bridés pour ne plus en produire. Elle cite un article de The Economist du 2026-07-30 selon lequel Claude est le seul modèle courant à en employer plus que les rédacteurs professionnels ; cet article n'a pas été relu à sa source.
- **Google, « Google developer documentation style guide », page « Tone »**, mise à jour le 2026-05-27, `developers.google.com/style/tone`. Elle déconseille « simply », « easy » et « quickly » dans une procédure, ainsi que « let's ». Les autres conseils (clair, simple, sans jargon ni cliché) sont ceux d'E-3 et E-12.
- **Microsoft, « Top 10 tips for Microsoft style and voice »**, ms.date 2026-07-02, `learn.microsoft.com/en-us/style-guide/top-10-tips-style-voice`. « Lead with what's most important », « Be brief », verbe en tête de phrase, pas de « there is » ni « there are ».
- **Commission européenne, « Code of Practice on Transparency of AI-generated Content »**, publication finale inscrite au calendrier de la page le 2026-06-10, article 50 applicable à partir du 2026-08-02, `digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content`. Un texte généré qui informe le public sur une question d'intérêt public se déclare, sauf relecture humaine sous responsabilité éditoriale.

Hors fenêtre, retenues pour le fond et non comptées : Barbara Minto, *The Pyramid Principle* (éditions de 1985 et de 1996 selon Wikipédia, « Barbara Minto », lue le 2026-10-19 ; d'autres sources donnent 1987) ; ISO 24495-1:2023, déjà citée par `references\ECRITURE.md` l.28. Limite : aucun guide d'éditeur francophone de moins de 24 mois n'a pu être lu, la page de la DITP sur le langage clair ayant répondu HTTP 403.

Les règles candidates qu'apportent ces sources se confrontent au plancher ainsi :

| Règle candidate | Source | Déjà dans le plancher | Mesure |
|---|---|---|---|
| Réponse d'abord | Minto ; Microsoft | oui : E-1 (l.66-71), gabarit d'étude | sans objet |
| Groupes exhaustifs et disjoints | Minto | oui : `gabarits\ETUDE-OPPORTUNITE.md` l.40 | sans objet |
| Un titre énonce sa conclusion | Minto ; Microsoft | non ; EC-8 refuse seulement l'annonce en titre | non mesurable par motif ; aucun retour humain ne la demande |
| Pas de mot qui juge la difficulté | Google | non | 17 occurrences de « simplement », « il suffit de », « rapidement » pour 197 679 mots bruts dans 95 fichiers, soit 0,09 ‰ |
| Voix active | Google (page « Voice », 2024-10-15, hors fenêtre) | citée comme source (l.29), sans règle ni contrôle | passif français non mesuré |
| Revue datée des listes de tournures | Wikipédia ; Kobak | non | 9 familles, 0 date de revue |

La mesure du mot de difficulté tient à `grep -r -i -o` sur `output\04-plans` et `output\03-etudes` ; elle compte aussi les emplois sans rapport avec une procédure. Même ainsi, 0,09 ‰ reste sous le plus bas seuil d'avertissement de la donnée (0,5 ‰, famille `formule-de-conversation`) : la famille ne se déclencherait jamais.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée, de peu. Le plancher couvre déjà le polissage. Mais les listes de tournures n'ont été relues qu'une fois, le 11/09/2026, et la page qui les fonde date désormais un de ses signes (« 2022 à septembre 2026 ») sans qu'aucune clé de la donnée dise qui la relit. Le statu quo laisse 9 familles sans rendez-vous avec leurs sources. Coût du statu quo : nul aujourd'hui, croissant à mesure que les modèles changent.
- **O1 — outiller l'humanisation** : un prompt ou un skill qui réécrit un texte pour qu'il passe un détecteur.
  - Coût : moyen × court, dette sans fin, puisque les détecteurs et les modèles bougent.
  - Exclut : le refus déjà écrit (`references\ECRITURE.md` l.15-16) et le ledger qui déclare ce qui est généré. La Factory n'emploie aucun détecteur et aucun lecteur ne lui en demande. Les lecteurs entraînés de Russell et al. repèrent le texte malgré l'humanisation (1 erreur sur 300). Ce n'est pas un objectif de la Factory, et elle ne l'outille pas.
- **O2 — ajouter des règles E-17 et suivantes** tirées des guides : titre-conclusion, mots de difficulté, voix active.
  - Coût : moyen × moyen (motifs, seuils, fixtures rouges et vertes, recalibrage sur 204 textes).
  - Exclut : la règle de la donnée, « la liste grossit par les retours humains, jamais par la devinette » (`references\tics-redactionnels.json` l.314). Aucun des 3 candidats n'a de retour humain, et le seul mesuré tombe à 0,09 ‰.
- **O3 — dater la revue des listes de tournures.**
  - Contenu : une clé `revue_prevue` et une clé `derniere_lecture` par famille dans la donnée (loi n° 4) ; une ligne dans « Comment le plancher se joue » de `references\ECRITURE.md` ; un contrôle EC-13 de l'oracle qui avertit, sans jamais échouer, quand `revue_prevue` est dépassée (loi n° 1 : une date que rien ne lit n'existe pas). La première revue est faite ici : le tiret d'incise reste compté, parce que E-8 repose sur la lisibilité (une phrase qui rebondit) et non sur la détection.
  - Coût : simple × court. Une clé de donnée à tenir, une règle d'avertissement avec ses 2 fixtures.
  - Exclut : toute règle nouvelle de style et tout outil de réécriture.
- **O4 — une passe de polissage par réécriture** avant chaque remise, comme le suggère la vidéo n° 24.
  - Coût : moyen × court par texte, soit 1 appel de modèle de plus par document, non mesuré.
  - Exclut : la maîtrise des faits. `references\ECRITURE.md` l.188-193 documente le cas où un outil de correction a « corrigé » l'exemple de défaut qu'une ligne devait montrer, qui « ne montrait plus rien ». Aucun gain de polissage n'a de mesure, alors que le hook et l'oracle font déjà signaler les défauts à l'auteur.

| Option | Contenu | Coût | Mesure | Exclusions |
|---|---|---|---|---|
| O0 | aucune action | nul | 9 familles sans date de revue | toute veille des listes |
| O1 | outil d'humanisation | moyen × court, dette sans fin | aucune | refus de l'ECRITURE.md |
| O2 | règles E-17 et suivantes | moyen × moyen | 0,09 ‰ pour le seul motif mesurable | règle « retours humains » de la donnée |
| O3 | revue datée des listes | simple × court | 9 familles, 1 clé de revue à ajouter | toute règle de style nouvelle |
| O4 | passe de réécriture | moyen × court par texte | aucune | maîtrise des faits et des exemples |

## 5. Verdict

- **Option retenue** : O3.
- **Pourquoi O3 et pas O0** : le coût est de l'ordre d'une clé de donnée et d'un avertissement, et la page source des tournures date elle-même un signe. Si vous jugez les listes assez stables, O0 reste acceptable : la perte serait lente, jamais brutale. **Pourquoi pas O1, O2, O4** : O1 sort de l'objectif de la Factory, O2 et O4 n'ont aucune mesure qui les justifie.
- **Coût** : simple × court. Environ 0 jeton à l'exécution, 1 clé de donnée à tenir à jour, 1 contrôle d'avertissement.
- **Candidature(s) émise(s)** :
  - candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 2, preuve 3, effort 1 (revue datée des listes de tournures, O3) ;
  - constat annexe, même forme : candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 3, preuve 4, effort 2 (comprendre pourquoi 16 textes sur 93 échouent à EC-9 alors que le hook avertit, et si les agents de campagne le reçoivent).
- **Plan de revue** : 2026-11-16, ou à la première relecture des listes si elle vient avant. Critères écrits d'avance : date de revue présente sur 9 familles sur 9 ; nombre d'avertissements EC-13 levés ; taux de réussite de `--baseline output\03-etudes` rejoué pour suivre le constat annexe.
- **Test rétro** :
  - *Opération → Tactique* : la clé de revue, la ligne de doctrine et le contrôle EC-13 répondent à P6 ; le premier relevé répond à P4 et à P3.
  - *Tactique → Stratégie* : garder le plancher d'écriture exact face à des modèles qui changent de tics, sans lui ajouter de règle sans retour humain.
  - *Stratégie → Intention* : vous vouliez savoir ce que la Factory doit faire de l'opportunité « style poli ou humanisé », sur des faits. Réponse : rien d'importé des vidéos, un seul objet durable minuscule, et un refus assumé de l'évasion de détecteur.
  - *Questions du demandeur rejouées* : « pertinente pour la Factory ? » — le polissage l'est, mais il est déjà couvert (chapitre 2) ; l'humanisation ne l'est pas. « Étude courte pour noter la pertinence ? » — 10 sur 25 au tri, confirmé sur le fond. « Je déciderai l'étude poussée » — aucune étude poussée n'est justifiée.
  - *Rupture constatée* : le contenu des 2 vidéos n'a pas été lu, seulement leur légende. La conclusion tient à ce que la Factory possède déjà, pas à ce que disent les vidéos.
