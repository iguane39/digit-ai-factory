---
destinataire: humain
---

# Synthèse d'étude — gestion de réseaux sociaux : ni forge ni logiciel, un rendez-vous hebdomadaire et neuf objets chez des porteurs existants ; il vous reste à accepter ou amender ce verdict (17/09/2026)

Votre étude sur la gestion de réseaux sociaux est faite, jugée, et remise aussi en page. Sa conclusion : il ne faut ni forge ni logiciel. LinkedIn interdit par contrat toute publication ou réponse automatisée, et réserve son accès aux chiffres à des éditeurs agréés ; publier et répondre restent donc vos gestes. Les chiffres de performance existent pourtant sans dépense, par un export manuel gratuit qui remonte jusqu'à 365 jours pour un profil. Ce qui manque vraiment est un rendez-vous : depuis la naissance du produit de communication, aucune publication n'est sortie, et personne n'est nommé pour tenir un calendrier entre 2 sessions de travail. L'étude retient donc un type de travail hebdomadaire, plus neuf objets confiés à des porteurs qui existent déjà. Rien n'est construit ni publié. Ce qui est attendu de vous : accepter ce verdict ou l'amender, ce qui décide des huit candidatures déposées.

## 1. En-tête d'identification

- **quoi** — exécution de l'action A-1 de la synthèse L99 (analyse de prompt en 8 couches) du matin, sur votre réponse « A1 », lue comme D-1 (a) : étude d'opportunité au gabarit, page homonyme, sept candidatures du verdict, une candidature de constat en passant, critique d'implémentation de la page.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; lectures seules chez `digit-ai-marketing`, `digit-ai-forge-agents`, `digit-ai-forge-design` et sur le skill installé `linkedin-post-generator`.
- **quand** — 2026-09-17 07:55 UTC+02:00 (Europe/Paris), heure relevée par `Get-Date` ; les heures affichées au point d'étape précédent étaient estimées et fausses ; durée mesurée du tour ≥ 15 min.
- **qui** — pilot `b284504` (aucun enregistrement fait dans ce tour) ; session Fable 5.1 au pilotage ; deux agents Sonnet délégués en lecture seule (recherche documentaire : 36 appels d'outils ; audit de skill : 20 appels), escalade de modèle : aucune ; oracles joués : `oracle-etude-opportunite`, `check_markdown.py`, `check_html`, `render_page`, `oracle-filtres-tableau`, `oracle-todo`, 6 oracles de forge-design et d'accessibilité, `oracle-synthese`.

## 2. Verdict en une ligne

**Étude : `oracle-etude-opportunite` 10 règles sur 10 PASS au premier passage, 25 lignes de recouvrement citées, 7 sources externes datées ; option O2 retenue (jeu fermé de cinq options) ; page : `check_html` PASS sur 40 règles, `render_page` PASS, `oracle-filtres-tableau` PASS ; critique d'implémentation : 4 oracles verts, 2 rouges sur la coquille du générateur (défaut de classe, candidature TF-1162) ; 8 candidatures ingérées, `oracle-todo` PASS ; tout indexé, aucun enregistrement, aucun push.**

## 3. Décisions attendues de l'humain

> **D-2 — Acceptez-vous le verdict de l'étude sur la gestion de réseaux sociaux (aucune forge, un type de travail hebdomadaire, neuf objets), et ses sept candidatures passent-elles à « décidé » ?**
>
> L'étude sur la gestion de réseaux sociaux conclut que huit des dix fonctions ont déjà un porteur, que publier et répondre restent vos gestes par contrat de la plateforme, et que le manque réel est une cadence. Elle propose un type de travail hebdomadaire chez le pilot, un modèle de publication à deux écritures, un référentiel daté des règles de LinkedIn, la reprise du skill de publication installé, un plan de mesure sur export manuel, et un premier cas réel : votre profil, 4 semaines, une publication par semaine, avec votre temps relevé avant et après.
>
> **Recommandation : (a).** Source consultée : `output\03-etudes\20260917-etude-opportunite-gestion-reseaux-sociaux.md` §2 quater (accès aux chiffres), §2 quinquies (forge refusée sur le premier critère de la règle 28), §4 et §5 ; conditions d'utilisation de LinkedIn en vigueur le 2025-11-03, §8.2 ; aide LinkedIn sur l'export des statistiques (365 jours). L'option (a) est la seule qui nomme qui tient le calendrier ; sans cela, le dossier des publications reste vide comme il l'est depuis le 11 septembre.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** accepter le verdict : les sept candidatures TF-1155 à TF-1161 passent à « décidé », dans l'ordre du plan de l'étude | effort moyen × court pour l'ensemble, réparti entre forge-agents, le pilot et le produit ; votre temps hebdomadaire : relire, publier, répondre, exporter, soit simple × court par compte | exclut une forge, un logiciel, et tout outil maison de publication ; exclut toute dépense avant la revue du 2026-10-09 |
| **(b)** accepter avec amendements — répondre « D-2 (b) sans TF-… », « D-2 (b) premier cas : la page » ou « D-2 (b) avec outil du marché » | même effort ; l'outil du marché ajoute une dépense récurrente, dont le prix reste à relever, et retire deux gestes par semaine | exclut un passage en bloc : chaque candidature écartée reste « candidat » avec votre motif |
| **(c)** ne pas donner suite | effort nul | exclut toute publication sous contrôle ; le skill installé continue de servir hors de toute forge, avec ses noms réels et ses règles de 2025 |

> **Si rien n'est décidé** : l'option (c) s'applique — les huit candidatures restent « candidat », l'étude sur la gestion de réseaux sociaux reste déposée, sa revue du 2026-10-09 la relira.

## 4. Traité — avec sa preuve

- **L'étude est déposée et jugée** : verdict O2 (deuxième des cinq options du jeu fermé : étendre l'existant, plus un type de travail hebdomadaire), dix fonctions fermées, test d'accès aux chiffres par type de compte, neuf objets attribués, plan en six lots, test rétro avec un élément retiré.
  - preuve : `node oracles\oracle-etude-opportunite.mjs` → « verdict=PASS », E1 à E10 PASS, « 25 ligne(s) de non-recouvrement, toutes citées », « 10 source(s) datée(s) » ; `check_markdown.py` → « Verdict : PASS », exit 0.
- **Sept sources externes datées ont été ouvertes et vérifiées** par un agent de recherche, et trois points restent déclarés non vérifiés (tarif et délai de l'agrément, méthode du rapport sur la portée, position de l'autorité française de protection des données).
  - preuve : rapport de l'agent, 36 appels d'outils ; dates relevées sur les pages : 2026-03-31, 2025-06, 2026-06, 2025-11-03, 2026-08-06, 2026-06-22, 2026-08-22.
- **Le skill de publication installé est audité** : 21/35, verdict « Refondre » forcé par un doublon de nom, deux personnes réelles et deux entreprises réelles en dur, règles de 2025 sans source datée, aucun oracle embarqué, 0 lien mort sur 8.
  - preuve : rapport de l'agent d'audit sous la grille `ameliore-un-skill`, 20 appels d'outils ; `python -m py_compile` sur copie → les deux scripts compilent.
- **Deux affirmations de l'étude du 11/09 sont corrigées par la mesure** : aucun modèle « publication réseau » n'existe dans le skill de communication, et le contrôle de transparence n'existe pas.
  - preuve : `presets-livrables.md` l.7-13, sept modèles, recherche « linkedin, réseau, publication, post » → « No matches found » ; `Test-Path C:\dev\digit-ai-marketing\scripts` → `False`.
- **La page homonyme est générée et jugée.**
  - preuve : `node scripts\generer-page-etude.mjs` → « page écrite », exit 0 ; `check_html.py` → « Verdict : PASS », 40 règles, empreinte 695359b17ff5 ; `render_page.py` → « Verdict : PASS » ; `oracle-filtres-tableau` → « "verdict": "PASS", "findings": [] ».
- **La critique d'implémentation de la page est jouée, et son verdict est : à reprendre sur la coquille, contenu conforme.** `oracle-a11y` PASS, `oracle-taste` PASS, `oracle-textes-application` PASS, `oracle-declencheurs` sans objet ; `oracle-slop` FAIL (2 règles dures : filet latéral de 3 px, blanc pur) ; `oracle-tokens` FAIL (13 écarts : deux couleurs en dur, espacements hors échelle). Classe du défaut : coquille partagée du générateur, mêmes comptes 2 et 13 sur la page du 15/09.
  - preuve : sorties des 6 oracles de `digit-ai-forge-design\oracles` et de `oracle-a11y.py` ; constat journalisé TF-1162.
- **Huit candidatures sont au registre.**
  - preuve : `node todo\ingerer-lot.mjs` → « 7 candidature(s) ingérée(s) en CANDIDAT (lot d75301a87d1b) », puis « 1 candidature(s) ingérée(s) (lot 364c8cad96fe) » ; identifiants TF-1155 à TF-1162, statut « candidat » ; `oracle-todo` → « PASS ».

## 5. Non traité — avec son motif

- La construction des neuf objets et l'ouverture du premier cas réel — motif : dépendance à une décision humaine (D-2) ; l'étude rend un verdict et des candidatures, la loi n° 5 laisse la décision à l'humain.
- La correction de la coquille du générateur de pages — motif : écarté de ce tour ; défaut de classe touchant 6 pages, journalisé TF-1162, à décider comme toute candidature. La page est remise avec ce défaut déclaré.
- L'enregistrement local et le push — motif : dépendance à une décision humaine ; la règle 38 des règles de projet fait du push d'un livrable un geste sur accord.
- Le prix d'un outil du marché agréé par LinkedIn — motif : écarté ; aucune source ouverte datée n'a été relevée, et l'étude ne recommande pas cette dépense avant la revue.

## 6. Écarts à la lettre

- **Vous avez écrit** « A1 » → **j'ai lu** « jouer l'étude avec le prompt réécrit tel quel », donc la présence de Digit-AI comme bénéficiaire et les neuf écarts validés → **pourquoi** : l'action A-1 n'était exécutable qu'à cette condition. Si vous visiez des clients ou un logiciel à vendre, répondez-le : l'option logiciel de l'étude se rouvre, et le test d'accès montre déjà qu'elle bute sur l'agrément de la plateforme.
- **Le prompt réécrit demandait** une liste de réseaux nommée par vous → **j'ai fermé** la liste à LinkedIn seul → **pourquoi** : aucun autre réseau n'a été nommé ; tout autre réseau est hors étude, et l'étude le dit.
- **Le prompt réécrit demandait** cinq sources ou plus → **j'en rends** sept, dont une secondaire (le rapport d'origine sur la portée est payant et n'a pas été ouvert) → **pourquoi** : déclaré dans l'étude plutôt que présenté comme vérifié.

## 7. Risques

- Le type de travail hebdomadaire est écrit, et le calendrier n'est pas tenu faute de temps ;
  - signal : moins de 4 accords de publication consignés à la revue du 2026-10-09 ;
  - parade : le temps humain est relevé chaque semaine ; la variante « outil du marché » se rouvre alors sur un chiffre, pas sur une impression.
- LinkedIn change ses conditions ou ses exports ;
  - signal : un export qui ne sort plus, ou une nouvelle version des conditions d'utilisation ;
  - parade : le référentiel daté porte une péremption au 2026-12-02 et se relit à cette date.
- Le skill installé continue de produire des publications hors de tout contrôle pendant que la décision attend ;
  - signal : une publication sortie sans mention de transparence ;
  - parade : acceptation déclarée jusqu'à D-2 ; l'information du lecteur est due depuis le 2026-08-02, et A-10 vous en rappelle le geste.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, dans l'ordre du plan de l'étude ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-8 | Exécuter le premier lot du plan de l'étude : écrire le référentiel daté de LinkedIn et sa déclaration dans `references\INTEGRATIONS-FOURNISSEURS.md` (TF-1156, TF-1161), puis `references\RUN-RESEAU.md` (TF-1158) | auto_ia | `dependance_bloc_3` — attend D-2 ; à défaut, les règles de la plateforme restent dans un skill hors forge | simple × court |
| A-9 | Enregistrer localement l'étude, sa page, les deux lots de candidatures, le registre et les deux synthèses du jour par `git commit --only -- <chemins>`, puis pousser le pilot (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-12 ; à défaut, les fichiers restent indexés en local | simple × court |
| A-10 | D'ici la décision, ajouter vous-même une mention « rédigé avec l'aide d'une IA » à toute publication issue du skill installé, dans l'éditeur de LinkedIn avant de cliquer « Publier » (neuve) | manuelle_utilisateur | `decision` — règle 38 : publier est un geste humain sur accord, et les conditions d'utilisation du 2025-11-03, §8.2, interdisent à un agent de « create […] posts » ; sinon : obligation d'information en vigueur depuis le 2026-08-02 non tenue | simple × court |
| A-11 | Trancher D-2 — répondre « D-2 (a) », « D-2 (b) sans TF-… », « D-2 (b) premier cas : la page » ou « D-2 (c) » (neuve) | manuelle_utilisateur | `decision` — loi n° 5 : l'IA fait, l'humain décide ; sinon : huit candidatures restent « candidat », aucune publication sous contrôle | simple × court |
| A-12 | Donner le feu vert d'enregistrement et de publication — répondre « enregistre et pousse » ou « enregistre seulement » (neuve) | manuelle_utilisateur | `decision` — règle 38 : le push d'un livrable est un geste sur accord ; sinon : l'étude reste indexée, non enregistrée | simple × court |

## 9. Traces

- Étude : `output\03-etudes\20260917-etude-opportunite-gestion-reseaux-sociaux.md` et sa page `output\03-etudes\20260917-etude-opportunite-gestion-reseaux-sociaux.html` — critique d'implémentation (forge-design, mode aval) : verdict « à reprendre sur la coquille, contenu conforme » ; 4 oracles verts, `oracle-slop` et `oracle-tokens` rouges, TF-1162.
- Candidatures : `input\01-candidatures\gestion-reseaux-sociaux-verdict-o2-20260917a.tf.jsonl` (TF-1155 à TF-1161) et `input\01-candidatures\coquille-page-etude-slop-tokens-20260917b.tf.jsonl` (TF-1162).
- Analyse L99 du matin : `output\03-etudes\20260917-L99-gestion-reseaux-sociaux.md`.
- Captures de rendu, hors dépôt : `%TEMP%\digit-ai-render\20260917-etude-opportunite-gestion-reseaux-sociaux`.
- Tout est indexé, rien n'est enregistré.
