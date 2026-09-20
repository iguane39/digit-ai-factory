---
destinataire: humain
---

# Synthèse de mandat — réseaux sociaux : votre décision est exécutée, les sept candidatures sont décidées et le premier lot est écrit ; la suite attend votre mandat d'écriture chez forge-agents (17/09/2026)

Votre décision sur la gestion de réseaux sociaux est exécutée. Les sept candidatures de l'étude sont passées à « décidé », et le premier lot du plan est écrit : les règles de LinkedIn ont un document daté avec sa date de péremption, LinkedIn est déclaré sans raccordement possible, et la factory a une sixième façon de travailler, l'animation de réseau, avec son rendez-vous hebdomadaire. Deux des trois candidatures du lot sont closes ; la troisième reste ouverte, parce que sa semaine d'essai à blanc dépend de pièces qui vivent chez forge-agents. Ce que cela change pour vous : la suite ne peut plus se faire dans le pilot seul. Ce qui est attendu de vous : dire si vous donnez mandat d'écrire chez forge-agents, et lequel des 2 skills de publication du même nom doit survivre.

## 1. En-tête d'identification

- **quoi** — exécution de votre réponse « 2a », soit D-2 (a) de la synthèse d'étude du jour : décision journalisée sur sept candidatures, puis action A-8 (premier lot du plan de l'étude : référentiel de la plateforme, déclaration aux intégrations, type de run).
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit : `references\`, `todo\TODO.jsonl`, `output\04-plans\`.
- **quand** — 2026-09-17 09:50 UTC+02:00 (Europe/Paris), heure relevée par `Get-Date` à 09:42 puis écriture ; durée mesurée du tour ≥ 20 min.
- **qui** — pilot `b284504` (aucun enregistrement fait dans ce tour) ; session Fable 5.1, aucune délégation, escalade de modèle : aucune ; oracles joués : `oracle-todo` (par `journaliser.mjs`, avant et après chaque écriture), `oracle-claude-md`, `check_markdown.py`, `oracle-synthese`.

## 2. Verdict en une ligne

**7 candidatures passées à « décidé » (TF-1155 à TF-1161), 2 closes en « corrige » (TF-1156, TF-1161), 1 en cours (TF-1158) ; 2 références écrites et 3 modifiées ; `oracle-claude-md` rouge → vert (N3 (règle du noyau : toute référence est atteignable depuis l'index), un orphelin du 14/09 rangé à l'index) ; `check_markdown.py` PASS sur les 2 références neuves, FAIL antérieur et inchangé sur le fichier des intégrations ; `oracle-todo` PASS après 10 événements ; tout indexé, aucun enregistrement, aucun push.**

## 3. Décisions attendues de l'humain

Éléments bloquants : un seul. La suite du plan des réseaux sociaux (le modèle de publication, la reprise du skill installé, la barre de qualité, le contrôle de transparence) s'écrit dans le dépôt forge-agents, où aucune écriture n'est permise sans votre mandat. Pour le lever, il faut votre réponse à D-3. Si rien n'est fourni, le type de run reste une séquence décrite et non prouvée, et aucune publication ne peut sortir sous contrôle.

> **D-3 — Donnez-vous mandat d'écrire chez forge-agents pour la suite du plan des réseaux sociaux, et lequel des 2 skills de publication LinkedIn du même nom doit survivre ?**
>
> La suite du plan des réseaux sociaux demande quatre écritures chez forge-agents : un modèle « publication réseau » à deux écritures dans le skill de communication, la reprise de ce que le skill de publication installé a d'utile sans ses noms réels ni ses règles de 2025, la barre de qualité d'une publication, et le contrôle de transparence. L'audit du 17 septembre a trouvé 2 skills de publication LinkedIn du même nom à votre poste, sans renvoi de l'un à l'autre ; tant que ce doublon n'est pas arbitré, la reprise ne sait pas de quelle copie partir.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fous (« aucune écriture dans les dépôts frères hors mandat humain ») ; `output\03-etudes\20260917-etude-opportunite-gestion-reseaux-sociaux.md` §2 ter et §5.2 (lots L-2 et L-3) ; registre, TF-1028 et TF-1030 (« en_cours », plans chiffrés le 14/09). La copie synchronisée est la seule que l'audit a lue en entier ; en partir évite un second audit.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** mandat donné pour TF-1155, TF-1157, TF-1028 et TF-1030 ; la reprise part de la copie synchronisée auditée, et l'autre copie est comparée avant tout retrait | effort moyen × court chez forge-agents, en boucle mandatée et journalisée ; puis la semaine d'essai à blanc du type de run, simple × court | exclut tout retrait d'un skill de votre poste par l'IA : le retrait reste votre geste |
| **(b)** mandat limité — répondre « D-3 (b) seulement TF-… », ou « D-3 (b) partir de l'autre copie » | effort réduit d'autant ; partir de l'autre copie ajoute son audit, simple × court | exclut la semaine d'essai tant que les quatre pièces ne sont pas là |
| **(c)** pas de mandat maintenant | effort nul | exclut toute publication sous contrôle ; le skill installé continue de servir hors de toute forge |

> **Si rien n'est décidé** : l'option (c) s'applique — les quatre candidatures de forge-agents restent ouvertes, le type de run sur les réseaux sociaux reste non prouvé jusqu'à la revue du 2026-10-09.

## 4. Traité — avec sa preuve

- **Votre décision D-2 (a) est journalisée sur les sept candidatures.**
  - preuve : `node todo\journaliser.mjs` → « ecrits=7 avant=PASS apres=PASS » ; TF-1155 à TF-1161 au statut « decide », décideur « humain (17/09/2026 : « 2a ») ».
- **Le référentiel daté de LinkedIn est écrit** (TF-1156, close) : contrat, quatre voies d'accès aux chiffres, transparence, portée mesurée, péremption au 2026-12-02 ; aucune « règle d'algorithme » sans source primaire n'y entre.
  - preuve : `references\PLATEFORME-LINKEDIN.md` ; `check_markdown.py` → « Verdict : PASS ».
- **LinkedIn est déclaré aux intégrations, sans connecteur** (TF-1161, close) : quatre faits, leur coût, la façon de les rejouer.
  - preuve : section « LinkedIn — aucun connecteur, et c'est une déclaration » de `references\INTEGRATIONS-FOURNISSEURS.md` ; `verifie_le: 2026-09-17`.
- **Le type de run « animation de réseau » est écrit, indexé et routé** (TF-1158, en cours) : ouverture, boucle hebdomadaire en cinq temps, revue mensuelle, consigne d'arrêt, trois gates humains.
  - preuve : `references\RUN-RESEAU.md` ; `check_markdown.py` → « Verdict : PASS » ; ligne ajoutée à `references\INDEX.md` et route ajoutée à `references\ACCUEIL.md`.
- **Correction d'un orphelin de l'index, contrôle rouge → vert** : `oracle-claude-md` refusait `references\CONVENTION-RECETTES.md`, présent depuis le 14/09 et absent de l'index. Classe : référence écrite sans sa ligne d'index.
  - preuve : avant → « N3 FAIL references\CONVENTION-RECETTES.md existe mais n'est cité ni par le noyau ni par un document qu'il cite » ; après → « claude-md verdict=PASS ».
- **Les deux clôtures et l'avancement sont journalisés, chaque clôture avec sa descente.**
  - preuve : premier essai refusé par la règle R12 du registre (clôture sans descente), écriture annulée par l'outil ; second essai → « ecrits=3 avant=PASS apres=PASS » ; `generer-vue.mjs` → « 384 actifs ».

## 5. Non traité — avec son motif

- La semaine d'essai à blanc du type de run, et les lots suivants du plan (modèle de publication, reprise du skill, barre, contrôle de transparence) — motif : garde-fou « aucune écriture dans les dépôts frères hors mandat humain », donc dépendance à une décision humaine (D-3).
- L'ouverture du run chez le produit et le premier cas réel de 4 semaines (TF-1160) — motif : dépendance externe ; ils attendent les pièces de forge-agents, puis votre accord d'ouverture chez le produit.
- Le défaut de lisibilité du fichier des intégrations — motif : écarté ; il est antérieur à ce tour (deux chapitres de 08/2026 sans phrase d'ouverture, version enregistrée déjà en échec), et ma section n'y ajoute rien. Constat laissé à A-14.
- J'ai abîmé `references\INDEX.md` par une commande de remplacement mal écrite, puis je l'ai restauré depuis git avant de refaire les ajouts à l'outil d'édition — motif de la mention : aucun reste, mais le fait est arrivé ; preuve : `git checkout -- references/INDEX.md`, puis `oracle-claude-md` PASS.
- L'enregistrement local et le push — motif : dépendance à une décision humaine ; la règle 38 des règles de projet fait du push un geste sur accord.

## 6. Écarts à la lettre

- **Vous avez écrit** « 2a » → **j'ai fait** D-2 (a) : sept candidatures décidées, puis le premier lot du plan → **pourquoi** : c'est le geste que l'option (a) commandait. Aucun écart sur le fond.
- **Le plan de l'étude plaçait** le type de run au quatrième lot → **je l'ai écrit** avec le premier → **pourquoi** : l'action A-8 annoncée regroupait les trois écritures du pilot ; sa preuve de « prêt » (la semaine d'essai) reste due, et TF-1158 reste ouverte pour cela.
- **Hors demande** : j'ai rangé à l'index un orphelin du 14/09 → **pourquoi** : il tenait rouge l'oracle qui sert de preuve à mon lot.

## 7. Risques

- Le type de run reste un texte, faute de semaine d'essai ;
  - signal : TF-1158 encore « en_cours » à la revue du 2026-10-09 ;
  - parade : D-3 (a) ouvre les quatre pièces ; l'essai à blanc suit aussitôt.
- Le référentiel de LinkedIn se périme sans que personne le relise ;
  - signal : date du jour postérieure au 2026-12-02 et `verifie_le` inchangé ;
  - parade : le type de run impose sa relecture à l'ouverture ; une sonde de péremption peut s'ajouter au plan de forge-observability avec TF-1159.
- Les fichiers indexés sont emportés par l'enregistrement d'une autre session du pilot, active ce matin ;
  - signal : un enregistrement d'une autre session contenant `RUN-RESEAU.md` ;
  - parade : acceptation déclarée ; A-13 enregistre par chemins nommés sur votre accord.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, celle qui attend D-3 avant celles qui attendent un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-15 | Ouvrir la boucle mandatée chez forge-agents : TF-1155 (modèle de publication), TF-1157 (reprise du skill), TF-1028 (barre), TF-1030 (contrôle de transparence), puis jouer la semaine d'essai à blanc de `references\RUN-RESEAU.md` (TF-1158) | auto_ia | `dependance_bloc_3` — attend D-3 ; à défaut, aucune publication ne sort sous contrôle | moyen × court |
| A-13 | Enregistrer localement, par `git commit --only -- <chemins>`, l'étude, sa page, les deux lots de candidatures, les cinq références, le registre et les trois synthèses du jour, puis pousser le pilot (neuve, remplace A-9) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-17 ; à défaut, tout reste indexé en local | simple × court |
| A-14 | Donner leur phrase d'ouverture aux deux chapitres de 08/2026 de `references\INTEGRATIONS-FOURNISSEURS.md`, contrôle `check_markdown.py` rouge → vert (neuve) | auto_ia | `hors_mandat` — défaut antérieur, hors de la décision D-2 ; à défaut, ce fichier reste en échec de lisibilité, sans effet sur les runs | simple × court |
| A-16 | Trancher D-3 — répondre « D-3 (a) », « D-3 (b) seulement TF-… », « D-3 (b) partir de l'autre copie » ou « D-3 (c) » (neuve) | manuelle_utilisateur | `decision` — garde-fou du noyau : aucune écriture chez une forge sans mandat humain ; sinon : la suite du plan est arrêtée | simple × court |
| A-17 | Donner le feu vert d'enregistrement et de publication — répondre « enregistre et pousse » ou « enregistre seulement » (neuve, remplace A-12) | manuelle_utilisateur | `decision` — règle 38 : le push d'un livrable est un geste sur accord ; sinon : rien n'est enregistré | simple × court |
| A-10 | D'ici là, ajouter vous-même la mention « rédigé avec l'aide d'une IA » à toute publication issue du skill installé, dans l'éditeur de LinkedIn avant « Publier » (neuve au tour précédent, reprise inchangée) | manuelle_utilisateur | `decision` — règle 38 : publier est un geste humain ; sinon : obligation d'information en vigueur depuis le 2026-08-02 non tenue | simple × court |

## 9. Traces

- Références écrites : `references\PLATEFORME-LINKEDIN.md`, `references\RUN-RESEAU.md` ; modifiées : `references\INTEGRATIONS-FOURNISSEURS.md`, `references\INDEX.md`, `references\ACCUEIL.md`.
- Registre : `todo\TODO.jsonl`, 10 événements (7 décisions, 2 clôtures, 1 avancement).
- Étude et synthèses du jour : `output\03-etudes\20260917-etude-opportunite-gestion-reseaux-sociaux.md`, `output\04-plans\Digit-AI - Synthese Etude - Gestion reseaux sociaux verdict O2 sans forge - 20260917c.md`.
- Aucune page HTML livrée dans ce tour. Tout est indexé, rien n'est enregistré.
