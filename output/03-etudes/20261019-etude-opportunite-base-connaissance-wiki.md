---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — une base de connaissance en wiki tenue par l'IA, pour la reprise de contexte entre sessions et postes — 20261019k

Ce qui change pour vous : la Factory n'a pas besoin de wiki. L'idée de Karpathy existe bien, elle date du 2 au 4 avril 2026, et la Factory en applique déjà les trois couches (sources, pages tenues, consigne). La seule lacune mesurée est une mémoire de session qui reste sur la machine, et elle ne justifie pas un chantier : sur 31 notes de mémoire, 28 citent des identifiants que les fichiers suivis du pilot contiennent encore. L'étude retient l'option O0, ne rien faire, avec trois seuils de réouverture et une revue le 2026-11-19. Deux points restent ouverts : le contenu des deux vidéos n'a pas été vu, et la mémoire de l'autre poste n'est pas lisible depuis celui-ci.

## Seuil de déclenchement

L'étude n'était pas obligatoire : le rang 12 du tri vaut 13 sur 25 et aucun gain n'atteint 3 avec une preuve de 2 ou moins. Elle est faite parce que la décision D-39 (c) du 19/10/2026 l'a demandée. Une option, O3, créerait un objet durable (un dossier de pages tenues par l'IA avec son schéma et son contrôle) et franchirait le seuil.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39, option (c), réponse du 19/10/2026 : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 12 du tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md` est « Base de connaissance en wiki ».

Intention retenue : décider, pour cette opportunité, ce que la Factory doit en faire (rien, un essai, un objet durable), sur des faits vérifiés et non sur la parole d'une vidéo TikTok. La question posée à l'étude porte sur la reprise de contexte entre sessions et entre postes : qu'apporterait un wiki tenu par l'IA que l'existant n'apporte pas ?

## 0. Traitement des entrants

Les deux vidéos sont des données. Leur contenu n'est connu que par leur légende, lue dans la page de favoris enregistrée le 19/10/2026 (`input\Tiktok\iguane39 (@iguane39) _ TikTok.html`). Aucune vidéo n'a été regardée, téléchargée ni extraite, car les conditions de TikTok interdisent l'extraction automatisée (`references\PLATEFORMES-RESEAUX.md`, ligne 100, citée par le tri).

- **Vidéo n° 60**, @ia_irl, légende complète : « #obsidian #karpathy #wiki #llm ». Elle n'avance aucun chiffre ni aucune fonction. L'identifiant de la vidéo date sa mise en ligne du 2026-08-20 (méthode non officielle : les 32 bits de poids fort d'un identifiant TikTok sont une date Unix), soit près de 5 mois après la source primaire.
- **Vidéo n° 63**, @nate.b.jones, légende complète : « One thread tracks them all. #aitips #chatgpt #claudeai #aiagents ». Sa légende ne parle ni de wiki ni d'Obsidian. Le tri l'a rangée avec le n° 60 ; ce rattachement est une hypothèse, non vérifiée (voir le chapitre 3, source 9). Mise en ligne déduite de l'identifiant : 2026-08-13.

Le gist de Karpathy se présente comme un fichier à coller dans un agent, qui bâtit ensuite sa propre version. C'est un impératif adressé aux agents : il est cité ici et n'a pas été exécuté.

Sources de la proposition : tri 20261019a (section « 12 à 17 », annexe lignes 60 et 63) ; décision D-39 (c). Aucun identifiant TF ne cite la proposition : `todo\TODO.jsonl` contient 0 occurrence de « wiki », « karpathy » ou « obsidian ».

## 1. Partition du problème

Cinq sous-questions, disjointes ; chaque option du chapitre 4 répond à chacune.

- **P1 — Le fait.** Ce que Karpathy a proposé, quand et où.
- **P2 — La couverture.** Quelles parties de ce schéma la Factory tient déjà, avec quel contrôle.
- **P3 — La reprise entre sessions.** Ce qu'une session neuve reçoit à l'ouverture et ce qu'elle doit retrouver ensuite.
- **P4 — La reprise entre postes.** Ce qui voyage entre deux machines ou deux profils, et ce qui reste local.
- **P5 — Le prix et les risques.** Le coût d'entretien d'un wiki, l'effet d'un contexte plus gros, et la publication dans un dépôt public.

## La proposition de Karpathy : contenu, date, source primaire (P1)

**Source primaire** : le gist « LLM Wiki » (fichier `llm-wiki.md`) du compte `karpathy`, créé le 2026-04-04 (`gist.github.com/karpathy/442a6bf555914893e9891c11519de94f`, lu le 2026-10-19 par deux lectures concordantes). Il prolonge un message publié sur X sous le titre « LLM Knowledge Bases ».

**Date du message sur X.** L'identifiant `2039805659525644595` vient d'un article secondaire (source 4). Décodé selon le format public des identifiants X, il donne le 2026-04-02 à 20:42 UTC, soit le 3 avril au Japon, ce qui explique que les articles se contredisent entre le 2 et le 3 avril. La page elle-même n'est pas lisible (HTTP 402) : la date reste déduite.

Contenu du gist, en deux lectures :
- **Idée** : au lieu de retrouver des morceaux de documents à chaque question (RAG), le LLM construit et entretient un wiki de pages Markdown liées. Citation : « the wiki is a persistent, compounding artifact ».
- **Trois couches** : les sources brutes, que le LLM lit sans les modifier ; le wiki, écrit et mis à jour par le LLM ; le schéma, un document de consigne comme `CLAUDE.md` ou `AGENTS.md`.
- **Trois opérations** : ingérer (une source peut toucher 10 à 15 pages), interroger (une bonne réponse peut être reclassée en page), contrôler (contradictions, affirmations périmées, pages orphelines, liens manquants).
- **2 fichiers** : `index.md`, catalogue lu en premier ; `log.md`, journal chronologique en ajout seul.
- **Obsidian** : « Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase ». Obsidian sert à lire le wiki, le LLM à l'écrire.
- **Échelle déclarée** : le schéma fonctionne « surprisingly well at moderate scale (~100 sources, ~hundreds of pages) » ; au-delà, un outil de recherche (qmd) devient utile. Le gist ne donne pas de limite stricte.
- **Nature du document** : une « idée » volontairement abstraite, sans code.

Ce que rapportent les sources secondaires, à tenir pour non vérifié : un wiki d'environ 100 articles et 400 000 mots sur un seul sujet, 16 millions de vues, 5 000 étoiles du gist.

## Mesure de l'existant

Mesures prises le 2026-10-19 sur ce poste, en lecture seule.

| Mesure | Valeur | Source |
|---|---|---|
| Fichiers de `references\` | 27 `.md` (527 823 octets) ; 38 fichiers de référence hors caches d'oracle ; 107 fichiers avec les caches | `find references -type f`, `wc -c references/*.md` |
| Index `references\INDEX.md` | 5 754 octets, 42 lignes, 31 lignes de tableau ; verdict N3 « aucune référence orpheline » | `wc`, `oracles\oracle-claude-md.mjs` |
| Noyau `CLAUDE.md` | 6 139 octets sur un plafond de 6 144 (N1 PASS) | `oracles\oracle-claude-md.mjs` |
| Mémoire de session, profil principal | 31 notes (74 817 octets) plus l'index `MEMORY.md` : 31 lignes, 8 617 octets | `~\.claude\projects\c--dev-digit-ai-factory\memory\` |
| Occupation de la limite de chargement | `MEMORY.md` : 31 lignes sur 200 (16 %), 8 617 octets sur 25 Ko (34 %) | documentation Claude Code, section « Auto memory » |
| Mémoire du second profil | 2 notes (3 554 octets avec l'index), dernière écriture le 2026-08-20 ; 0 transcription de ce projet, contre 52 au profil principal | `~\.claude-b\projects\c--dev-digit-ai-factory\` |
| Ancrage des notes dans git | 28 notes sur 31 citent des identifiants (TF, R, D) tous présents dans les fichiers suivis du pilot, registre exclu ; 3 notes n'en citent aucun | script de mesure jetable, `git grep -F -w` sur 31 notes |
| Registre `todo\TODO.jsonl` | 4 995 lignes, 5 262 121 octets ; 1 890 items actifs et archivés au périmètre de `todo\RECIDIVES.md` | `wc`, `todo\RECIDIVES.md` ligne 7 |
| Index README générés | 91 fichiers `README.md` dans le dépôt ; `output\` compte 617 fichiers, `output\LISEZMOI.md` 90 631 octets | `find`, `scripts\readme-dossiers.mjs` |
| Skills installés | 34 sous `~\.claude\skills\`, dont `graphify` ; aucun nommé wiki, mémoire ou Karpathy ; 0 dossier `graphify-out` sous `c:\dev\` | `ls` |
| Historique git | 1 634 commits, 3 312 fichiers suivis ; dépôt du pilot PUBLIC | `git log`, `git ls-files`, `gh repo view` |

Lecture. La mémoire pèse peu et loge dans sa limite de chargement. Les 3 notes sans identifiant sont des consignes de pratique ou de réglage du poste (`commit-only-chez-les-produits`, `reglages-poste-deux-profils`, `verbosite-cible-statuts-pas-restitution`). L'ancrage mesure la présence d'un identifiant, pas celle de la leçon : c'est un indice, pas une preuve.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Couche « schéma » du gist | `CLAUDE.md` ligne 12 : « Noyau ≤ 6 Ko (`oracle-claude-md.mjs`) ; détail : `references\INDEX.md` » ; verdict N1 : 6 139 octets sur 6 144 | recouvre : le noyau joue le rôle de `CLAUDE.md` du gist, et il est saturé, donc il ne peut pas porter un wiki |
| Fichier `index.md` du gist | `references\INDEX.md` lignes 3 à 8 : toute référence absente de l'index est « orpheline », et l'oracle refuse l'orphelin dans les deux sens | recouvre : un catalogue à jour, tenu par un contrôle, à 5 754 octets |
| Opération « contrôler » du gist | `oracles\oracle-claude-md.mjs` ligne 7, règle N3 ; `oracles\oracle-fraicheur-doc.mjs` lignes 2 à 4 (le nombre cité par un document doit égaler le nombre constaté) ; `oracles\oracle-readme-dossiers.mjs` | recouvre : orphelins, chiffres périmés et index obsolètes sont jugés par des oracles exécutés, pas par un LLM relisant ses pages |
| Fichier `log.md` du gist | `todo\TODO.jsonl` (4 995 lignes) et `todo\RECIDIVES.md` ligne 7 : « 1890 item(s) au registre, 939 portant une classe, 493 marqué(s) récidive » ; 1 634 commits | recouvre : un journal daté, structuré, avec classes et récidives ; plus riche que `log.md` |
| Couche « sources brutes » du gist | `input\` et la mémoire `reception-lot-immuable-apres-ingestion.md` (« lot ingéré immuable », R-49) | recouvre : les lots reçus sont figés avant ingestion |
| Leçons promues en règles | `references\REGLES-DE-NON-REPETITION.md` ligne 2 : « règles génériques nées des défauts RÉELLEMENT rencontrés — chacune avec le mécanisme qui l'exécute » ; règle E8 dans `oracles\oracle-etude-opportunite.mjs` ligne 16 et `gabarits\ETUDE-OPPORTUNITE.md` ligne 64 | recouvre : la note du second profil « effort en niveaux, jamais en jours » (20/08/2026) est devenue un oracle ; la note « restitution adaptée » du même jour a son gabarit à `gabarits\RESTITUTION.md` ligne 22 |
| Mémoire de session | Documentation Claude Code, « Auto memory is machine-local. […] Files are not shared across machines or cloud environments » ; 31 notes, aucun fichier du pilot ne cite `MEMORY.md` (recherche hors `input\00-retours\` et `output\`) | recouvre la reprise entre sessions du même profil ; ne recouvre pas la reprise entre postes, seule lacune confirmée |
| Reprise entre postes | `oracles\hook-reprise.mjs` lignes 2 à 3 : « la reprise d'un produit sur un autre poste, jouée sans geste humain (R-64, TF-1736) » ; `gabarits\RESTITUTION.md` ligne 264 | recouvre les fichiers d'un produit qui déclare `forge\REPRISE.json` ; ne recouvre pas la mémoire de session du pilot |
| Générateur de wiki installé | `~\.claude\skills\graphify\SKILL.md` ligne 33 : « --wiki : build agent-crawlable wiki (index.md + one article per community) », ligne 34 `--obsidian` ; aucun `graphify-out` | recouvre en capacité, pas en service : l'outil existe, rien n'a été construit ; l'opportunité 5 du tri l'essaie déjà |
| Catalogue par dossier | `scripts\readme-dossiers.mjs` lignes 2 à 4 : un `README.md` vivant par dossier d'`input\` et d'`output\`, régénéré par hook | recouvre : une table des fichiers déterministe, sans LLM |

Le tri écrivait que l'index, la mémoire et graphify « couvrent déjà ce besoin ». Les mesures nuancent : l'index et le registre le couvrent ; la mémoire le couvre au sein d'un profil ; graphify le couvrirait mais n'a jamais été lancé.

## 3. État de l'art daté

Neuf sources, toutes postérieures au 2024-10-19. Les trois premières portent sur la proposition elle-même.

1. **Andrej Karpathy, gist « LLM Wiki »**, 2026-04-04, `gist.github.com/karpathy/442a6bf555914893e9891c11519de94f` : source primaire, décrite au chapitre précédent. Aucune mesure ni code : c'est un patron. Lue par un outil qui résume la page, non en texte brut.
2. **Andrej Karpathy, message X « LLM Knowledge Bases »**, 2026-04-02 à 20:42 UTC (déduite de l'identifiant), `x.com/karpathy/status/2039805659525644595` : source primaire non lisible (HTTP 402). Sa date et son titre viennent des sources 3 et 4.
3. **Marcus Schuler, Implicator**, 2026-04-14, `implicator.ai/karpathys-llm-wiki-got-16-million-views-the-code-isnt-the-point-2/` : secondaire. Reprend 16 millions de vues, 100 000 signets, 5 000 étoiles, environ 100 articles et 400 000 mots sur un sujet, sans base vectorielle.
4. **Classmethod, « Karpathy 氏が言語化した LLM Knowledge Base というパターン »**, 2026-04-05, `dev.classmethod.jp/articles/karpathy-llm-knowledge-base/` : secondaire. Donne l'adresse du message X et 13 millions de vues, ce qui est cohérent avec les 16 millions du 14 avril.
5. **Anthropic, « Effective context engineering for AI agents »**, 2025-09-29, `anthropic.com/engineering/effective-context-engineering-for-ai-agents` : l'agent « regularly writes notes persisted to memory outside of the context window ». Ce texte soutient le principe de notes persistantes, et recommande des références légères chargées à la demande.
6. **Anthropic, « Effective harnesses for long-running agents »**, 2025-11-26, `anthropic.com/engineering/effective-harnesses-for-long-running-agents` : le relais entre sessions repose sur un fichier de progression, l'historique git et une liste de fonctions en JSON. C'est le mécanisme que la Factory a déjà : registre, git, restitution.
7. **Claude Code, documentation « How Claude remembers your project »**, lue le 2026-10-19, `code.claude.com/docs/en/memory` : la mémoire automatique charge les 200 premières lignes ou 25 Ko de `MEMORY.md` ; elle est locale à la machine et rattachée au dépôt git.
8. **Gloaguen, Mündler-Sasahara, Müller, Raychev, Vechev, « Evaluating AGENTS.md »**, arXiv 2602.11988, v1 du 2026-02-12 (v3 du 2026-09-29), `arxiv.org/abs/2602.11988` : des fichiers de contexte de dépôt n'améliorent pas en général le taux de réussite et augmentent le coût d'inférence de plus de 20 % ; les aperçus de dépôt n'aident pas. Plus de contexte à l'ouverture n'est donc pas un gain en soi.
9. **Nate B. Jones, « Why your AI starts from zero every time… Open Brain »**, 2026-03-02, `natesnewsletter.substack.com/p/every-ai-you-use-forgets-you-heres` : une base Postgres avec vecteurs et un serveur MCP, interrogeables par tous les outils d'IA, pour environ 0,10 à 0,30 dollar par mois. Texte payant, lu en partie. C'est une piste pour la vidéo n° 63, jamais confirmée : sa légende ne cite pas ce nom.

Ce que l'état de l'art établit : le patron de Karpathy est un patron de mémoire persistante parmi d'autres (sources 5 et 6) ; ses chiffres sont ceux de la presse ; et le seul test publié sur l'ajout de fichiers de contexte (source 8) donne un résultat nul ou négatif sur le succès, avec un surcoût. Aucune des neuf sources ne mesure un gain de reprise de contexte entre sessions ou entre postes.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Retenue pour le wiki. Le coût du statu quo se lit au registre de la mémoire : 3 incidents entre deux postes (`deux-postes-publient-en-meme-temps`, `rebase-pilot-registre-deux-postes`, `synchro-travail-fait-deux-fois`, du 20 au 28/09/2026). Chacun naît d'une publication en retard ou d'un numéro frappé des deux côtés, pas d'une leçon absente : un wiki ne l'aurait pas évité. Le surcoût d'un contexte plus gros est documenté (source 8).
- **O1 — essai court de `graphify --wiki` sur le pilot**, hors dépôt, rattaché à l'opportunité 5 du tri. Contenu : construire le graphe et le wiki de `references\` et de `gabarits\`, puis poser 10 questions de reprise avec et sans le wiki, en comptant jetons et réponses justes. Coût : simple × court, plus des jetons d'extraction non mesurés. Exclut : tout objet durable, toute écriture dans le pilot.
- **O2 — miroir privé de la mémoire de session.** Contenu : copier les 31 notes dans un dépôt privé, synchronisé entre postes. Coût : moyen × court ; la création d'un dépôt hébergé exige un GO humain (R-38). Exclut : le wiki lui-même. Il traite la seule lacune confirmée, mais les 28 notes ancrées existent déjà côté git sous forme d'identifiants, et le profil secondaire dormant ne perd rien.
- **O3 — un wiki de la Factory tenu par l'IA, objet durable.** Contenu : un dossier de pages entretenues par un agent, avec schéma, opérations d'ingestion, de requête et de contrôle, et un oracle de cohérence. Coût : complexe × long. Exclut : la simplicité du noyau. Risques mesurés : une deuxième source de vérité à côté de 27 références et d'un registre de 5 262 121 octets ; un dépôt de pilot public où chaque page est soumise à la porte de publication des noms ; un surcoût de contexte (source 8) ; des contrôles déjà tenus par des oracles (chapitre 2).
- **O4 — rendre la mémoire traçable, sans wiki.** Contenu : un relevé périodique, en lecture seule, des notes de mémoire dont les identifiants ne figurent plus dans git, posées comme candidats de promotion en règle. Coût : simple × court. Exclut : toute génération de pages. Le relevé fournirait déjà la mesure qui fonde la revue de O0 (28 sur 31) ; l'inscrire comme objet durable avant d'avoir un cas où il aurait servi ne se justifie pas.

## 5. Verdict

- **Option retenue** : O0.
- **Pourquoi pas O1** : l'essai recouvre l'opportunité 5 ; il se joue une fois, avec elle, et ne justifie pas une décision à part. Si l'opportunité 5 est lancée, ajouter à son protocole une ligne : le wiki produit par `--wiki` répond-il aux 10 questions mieux que `references\INDEX.md` ?
- **Pourquoi pas O2, O3, O4** : la lacune de reprise entre postes n'a causé aucune perte de leçon constatée ; le profil secondaire n'a reçu aucune session sur ce projet ; O3 double des mécanismes déjà jugés par des oracles ; O4 outille un risque non encore observé.
- **Coût** : simple × court, car l'option ne crée rien. La mesure d'ancrage, le seul geste associé, tient en un script jetable.
- **Candidature(s) émise(s)** : candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 1, preuve 4, effort 1. Objet : clore l'opportunité 12 sans objet durable, consigner les trois seuils de réouverture ci-dessous et rattacher la question du wiki à l'essai de l'opportunité 5. Je n'écris pas au registre.
- **Plan de revue** : 2026-11-19. Rejouer la mesure de l'existant (ancrage des notes, taille de `MEMORY.md`) et relire le registre. Seuils de réouverture, écrits d'avance : (1) moins de 25 notes sur 31 ancrées dans git ; (2) `MEMORY.md` au-delà de 20 000 octets, soit 80 % de la limite de chargement ; (3) un incident de leçon perdue entre deux postes, consigné au registre. Un seul seuil atteint rouvre l'étude à partir de O2.
- **Test rétro** :
  - *Opération → Tactique* : le choix de ne rien créer répond à P2 (chaque couche du gist a son équivalent, chapitre 2), à P3 et P4 (la seule lacune est locale à la mémoire, et elle n'a rien coûté), à P5 (O3 doublerait des contrôles et alourdirait le contexte).
  - *Tactique → Stratégie* : ne pas ajouter de mécanisme quand un oracle exécuté fait déjà le travail, et laisser les leçons suivre la voie existante, de la mémoire à la règle puis au contrôle.
  - *Stratégie → Intention* : vous vouliez décider, sur des faits, entre rien, un essai et un objet durable. Les faits : 28 notes sur 31 ancrées, 3 incidents sans lien avec l'absence de wiki, un test publié défavorable au contexte supplémentaire. La réponse est « rien », avec un essai gratuit si l'opportunité 5 est lancée.
  - *Questions du demandeur rejouées* : « notes de pertinence » : le rang 12 et son score de 13 sont confirmés, pour des raisons mesurées. « Tri de la plus à la moins pertinente » : la position ne change pas. « Quelles études poussées lancer » : celle-ci conclut qu'elle n'appelle pas de suite propre.
  - *Rupture constatée* : le tri tenait graphify pour une couverture acquise ; l'outil n'a jamais été lancé, c'est donc une capacité. Elle est déclarée, pas comblée.
  - *Hypothèses non résolues* : le contenu des vidéos n° 60 et n° 63 n'est connu que par leur légende ; la mémoire de l'autre poste n'a pas été lue ; le message X n'a pas pu être ouvert ; les chiffres de presse sur le wiki de Karpathy ne sont pas vérifiés.
